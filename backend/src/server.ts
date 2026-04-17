import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// ===================== Security =====================
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4000'],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { error: 'Trop de requêtes, réessayez plus tard' },
});
app.use('/api/', limiter);

// ===================== Body parsing =====================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ===================== Routes =====================
app.get('/', (_req, res) => {
  res.json({
    name: 'Outlander Gear Co. API',
    version: '2.0.0',
    endpoints: {
      products:   'GET  /api/products',
      featured:   'GET  /api/products/featured',
      product:    'GET  /api/products/:slug',
      categories: 'GET  /api/categories',
      auth:       'POST /api/auth/register | /api/auth/login | GET /api/auth/me',
      cart:       'GET|POST|PUT|DELETE /api/cart',
      orders:     'GET|POST /api/orders',
      reviews:    'GET|POST /api/reviews/product/:id',
    },
  });
});

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/reviews',    reviewRoutes);

// ===================== Error handling =====================
app.use(notFound);
app.use(errorHandler);

// ===================== Start =====================
app.listen(PORT, () => {
  console.log(`🚀 Outlander Gear Co. API v2.0 — http://localhost:${PORT}`);
  console.log(`📦 Endpoints: /api/products, /api/categories, /api/auth, /api/cart, /api/orders, /api/reviews`);
});

export default app;
