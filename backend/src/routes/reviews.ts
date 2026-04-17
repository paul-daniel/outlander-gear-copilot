import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth';
import { reviewSchema } from '../validators';

const router = Router();

// GET /api/reviews/product/:productId — Reviews for a product (public)
router.get('/product/:productId', async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);

    const result = await pool.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );

    res.json(result.rows);
  } catch (err: any) {
    console.error('Reviews list error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// POST /api/reviews/product/:productId — Create review
router.post('/product/:productId', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const data = reviewSchema.parse(req.body);
    const userId = req.user!.userId;

    // Check product exists
    const product = await pool.query('SELECT id FROM products WHERE id = $1', [productId]);
    if (product.rows.length === 0) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }

    // Insert review (unique constraint handles duplicates)
    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, title, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [productId, userId, data.rating, data.title || null, data.comment || null]
    );

    // Update product rating
    await pool.query(
      `UPDATE products SET
         rating_avg = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = $1),
         rating_count = (SELECT COUNT(*) FROM reviews WHERE product_id = $1)
       WHERE id = $1`,
      [productId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Vous avez déjà laissé un avis pour ce produit' });
      return;
    }
    if (err.name === 'ZodError') {
      res.status(400).json({ error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Create review error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
