import { Router, Request, Response } from 'express';
import pool from '../config/database';

const router = Router();

// GET /api/categories — All categories with product count
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(p.id)::int AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Categories error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /api/categories/:slug — Single category with products
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const catResult = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);

    if (catResult.rows.length === 0) {
      res.status(404).json({ error: 'Catégorie non trouvée' });
      return;
    }

    const products = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE c.slug = $1 AND p.is_active = TRUE
       ORDER BY p.name ASC`,
      [slug]
    );

    res.json({
      category: catResult.rows[0],
      products: products.rows,
    });
  } catch (err: any) {
    console.error('Category detail error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
