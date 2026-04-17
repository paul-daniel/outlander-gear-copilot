import { Router, Request, Response } from 'express';
import pool from '../config/database';
import { productQuerySchema } from '../validators';

const router = Router();

// GET /api/products — List products with filtering, search, pagination
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = productQuerySchema.parse(req.query);
    const conditions: string[] = ['p.is_active = TRUE'];
    const values: any[] = [];
    let paramIdx = 1;

    if (query.category) {
      conditions.push(`c.slug = $${paramIdx++}`);
      values.push(query.category);
    }

    if (query.search) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`);
      values.push(`%${query.search}%`);
      paramIdx++;
    }

    if (query.min_price !== undefined) {
      conditions.push(`p.price >= $${paramIdx++}`);
      values.push(query.min_price);
    }

    if (query.max_price !== undefined) {
      conditions.push(`p.price <= $${paramIdx++}`);
      values.push(query.max_price);
    }

    if (query.featured) {
      conditions.push('p.is_featured = TRUE');
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY p.created_at DESC';
    switch (query.sort) {
      case 'price_asc':  orderBy = 'ORDER BY p.price ASC'; break;
      case 'price_desc': orderBy = 'ORDER BY p.price DESC'; break;
      case 'name':       orderBy = 'ORDER BY p.name ASC'; break;
      case 'newest':     orderBy = 'ORDER BY p.created_at DESC'; break;
      case 'rating':     orderBy = 'ORDER BY p.rating_avg DESC, p.rating_count DESC'; break;
    }

    const offset = (query.page - 1) * query.limit;

    // Count total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`,
      values
    );
    const total = parseInt(countResult.rows[0].count, 10);

    // Fetch page
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}
       ${orderBy}
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...values, query.limit, offset]
    );

    res.json({
      products: result.rows,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        total_pages: Math.ceil(total / query.limit),
      },
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: 'Paramètres invalides', details: err.errors });
      return;
    }
    console.error('Products list error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /api/products/featured — Featured products
router.get('/featured', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = TRUE AND p.is_featured = TRUE
       ORDER BY p.rating_avg DESC
       LIMIT 8`
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Featured products error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /api/products/:slug — Single product by slug
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.is_active = TRUE`,
      [slug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produit non trouvé' });
      return;
    }

    // Also fetch reviews
    const reviews = await pool.query(
      `SELECT r.*, u.first_name, u.last_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [result.rows[0].id]
    );

    // Related products from same category
    const related = await pool.query(
      `SELECT p.id, p.name, p.slug, p.price, p.compare_price, p.image_url, p.rating_avg
       FROM products p
       WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = TRUE
       ORDER BY p.rating_avg DESC
       LIMIT 4`,
      [result.rows[0].category_id, result.rows[0].id]
    );

    res.json({
      ...result.rows[0],
      reviews: reviews.rows,
      related_products: related.rows,
    });
  } catch (err: any) {
    console.error('Product detail error:', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
