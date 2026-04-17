import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { env } from '../config/env';
import { registerSchema, loginSchema } from '../validators';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// POST /api/auth/register
router.post('/register', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = registerSchema.parse(req.body);

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [data.email]);
  if (existing.rows.length > 0) {
    res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    return;
  }

  const hash = await bcrypt.hash(data.password, 12);

  const result = await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, role, created_at`,
    [data.email, hash, data.first_name, data.last_name, data.phone || null]
  );

  const user = result.rows[0];
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  res.status(201).json({ user, token });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = loginSchema.parse(req.body);

  const result = await pool.query(
    'SELECT id, email, password_hash, first_name, last_name, role, created_at FROM users WHERE email = $1',
    [data.email]
  );

  if (result.rows.length === 0) {
    res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    return;
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(data.password, user.password_hash);

  if (!valid) {
    res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  const { password_hash, ...userPublic } = user;
  res.json({ user: userPublic, token });
}));

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await pool.query(
    'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = $1',
    [req.user!.userId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Utilisateur non trouvé' });
    return;
  }

  res.json(result.rows[0]);
}));

export default router;
