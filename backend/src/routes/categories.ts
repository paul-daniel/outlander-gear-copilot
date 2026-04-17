import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// GET /api/categories — All categories with product count
router.get('/', asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const result = await pool.query(
    `SELECT c.*, COUNT(p.id)::int AS product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.is_active = TRUE
     GROUP BY c.id
     ORDER BY c.name ASC`
  );
  res.json(result.rows);
}));

// GET /api/categories/:slug — Single category with products
router.get('/:slug', asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
}));

export default router;
