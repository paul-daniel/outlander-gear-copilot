import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { cartItemSchema, updateCartItemSchema } from '../validators';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

// GET /api/cart — Get user's cart
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await pool.query(
    `SELECT ci.*, p.name, p.slug, p.price, p.image_url, p.stock_quantity
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.user_id = $1
     ORDER BY ci.created_at DESC`,
    [req.user!.userId]
  );

  const items = result.rows;
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  res.json({ items, total: Math.round(total * 100) / 100, count: items.length });
}));

// POST /api/cart — Add item to cart (or update quantity)
router.post('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = cartItemSchema.parse(req.body);

  // Check product exists and has stock
  const product = await pool.query(
    'SELECT id, stock_quantity FROM products WHERE id = $1 AND is_active = TRUE',
    [data.product_id]
  );

  if (product.rows.length === 0) {
    res.status(404).json({ error: 'Produit non trouvé' });
    return;
  }

  if (product.rows[0].stock_quantity < data.quantity) {
    res.status(400).json({ error: 'Stock insuffisant' });
    return;
  }

  // Upsert
  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + $3
     RETURNING *`,
    [req.user!.userId, data.product_id, data.quantity]
  );

  res.status(201).json(result.rows[0]);
}));

// PUT /api/cart/:productId — Update quantity
router.put('/:productId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId as string, 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: 'ID produit invalide' });
    return;
  }

  const data = updateCartItemSchema.parse(req.body);

  const result = await pool.query(
    `UPDATE cart_items SET quantity = $1
     WHERE user_id = $2 AND product_id = $3
     RETURNING *`,
    [data.quantity, req.user!.userId, productId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Article non trouvé dans le panier' });
    return;
  }

  res.json(result.rows[0]);
}));

// DELETE /api/cart/:productId — Remove item
router.delete('/:productId', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId as string, 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: 'ID produit invalide' });
    return;
  }

  const result = await pool.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING id',
    [req.user!.userId, productId]
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Article non trouvé dans le panier' });
    return;
  }

  res.json({ message: 'Article retiré du panier' });
}));

// DELETE /api/cart — Clear cart
router.delete('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [req.user!.userId]);
  res.json({ message: 'Panier vidé' });
}));

export default router;
