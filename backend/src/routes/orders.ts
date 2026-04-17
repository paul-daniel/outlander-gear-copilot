import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';
import { createOrderSchema } from '../validators';

const router = Router();

router.use(authenticate);

// GET /api/orders — User's orders
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [req.user!.userId]
  );
  res.json(result.rows);
}));

// GET /api/orders/:id — Single order with items
router.get('/:id', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const orderId = parseInt(req.params.id as string, 10);
  if (isNaN(orderId)) {
    res.status(400).json({ error: 'ID commande invalide' });
    return;
  }

  const [orderResult, itemsResult] = await Promise.all([
    pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user!.userId]
    ),
    pool.query(
      `SELECT oi.*, p.name, p.image_url, p.slug
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    ),
  ]);

  if (orderResult.rows.length === 0) {
    res.status(404).json({ error: 'Commande non trouvée' });
    return;
  }

  res.json({ ...orderResult.rows[0], items: itemsResult.rows });
}));

// POST /api/orders — Create order from cart
router.post('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = createOrderSchema.parse(req.body);
  const userId = req.user!.userId;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get cart items with current prices
    const cartResult = await client.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity, p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Le panier est vide' });
      return;
    }

    // Check stock and calculate total
    let total = 0;
    for (const item of cartResult.rows) {
      if (item.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        res.status(400).json({
          error: `Stock insuffisant pour "${item.name}" (${item.stock_quantity} disponible)`,
        });
        return;
      }
      total += item.price * item.quantity;
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, Math.round(total * 100) / 100, data.shipping_address, data.payment_method || 'card', data.notes || null]
    );

    const order = orderResult.rows[0];

    // Batch insert order items with unnest instead of N individual inserts
    const productIds = cartResult.rows.map((i: any) => i.product_id);
    const quantities = cartResult.rows.map((i: any) => i.quantity);
    const prices = cartResult.rows.map((i: any) => i.price);

    await client.query(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
       SELECT $1, unnest($2::int[]), unnest($3::int[]), unnest($4::numeric[])`,
      [order.id, productIds, quantities, prices]
    );

    // Batch decrement stock in a single query
    await client.query(
      `UPDATE products SET stock_quantity = stock_quantity - data.qty
       FROM (SELECT unnest($1::int[]) AS pid, unnest($2::int[]) AS qty) AS data
       WHERE products.id = data.pid`,
      [productIds, quantities]
    );

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}));

export default router;
