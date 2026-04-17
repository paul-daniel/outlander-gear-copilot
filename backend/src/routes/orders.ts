import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth';
import { createOrderSchema } from '../validators';

const router = Router();

router.use(authenticate);

// GET /api/orders — User's orders
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Orders list error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /api/orders/:id — Single order with items
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = parseInt(req.params.id, 10);

    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user!.userId]
    );

    if (orderResult.rows.length === 0) {
      res.status(404).json({ error: 'Commande non trouvée' });
      return;
    }

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name, p.image_url, p.slug
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({ ...orderResult.rows[0], items: itemsResult.rows });
  } catch (err: any) {
    console.error('Order detail error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// POST /api/orders — Create order from cart
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    const data = createOrderSchema.parse(req.body);
    const userId = req.user!.userId;

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

    // Create order items + decrement stock
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(201).json(order);
  } catch (err: any) {
    await client.query('ROLLBACK');
    if (err.name === 'ZodError') {
      res.status(400).json({ error: 'Données invalides', details: err.errors });
      return;
    }
    console.error('Create order error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  } finally {
    client.release();
  }
});

export default router;
