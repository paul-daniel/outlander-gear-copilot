import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import copilotRoutes from './routes/copilot';
import { errorHandler, notFound } from './middleware/errorHandler';
import pool from './config/database';

const app = express();

// ===================== Security =====================
app.use(helmet());
app.use(cors({
  origin: env.corsOrigins,
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { error: 'Trop de requêtes, réessayez plus tard' },
});
app.use('/api/', limiter);

// ===================== Body parsing & compression =====================
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ===================== Routes =====================
app.get('/', (_req, res) => {
  res.json({
    name: 'Outlander Gear Co. API',
    version: '3.0.0',
    endpoints: {
      products:   'GET  /api/products  (filter: category, search, min_price, max_price, featured, tags, sort, page, limit)',
      featured:   'GET  /api/products/featured',
      product:    'GET  /api/products/:slug  (includes specifications, tags, reviews, related)',
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
app.use('/api/copilot',    copilotRoutes);

// ===================== Error handling =====================
app.use(notFound);
app.use(errorHandler);

// ===================== Start =====================
const server = app.listen(env.port, () => {
  console.log(`🚀 Outlander Gear Co. API v3.0 — http://localhost:${env.port}`);
  console.log(`📦 Endpoints: /api/products, /api/categories, /api/auth, /api/cart, /api/orders, /api/reviews`);
});

// ===================== Graceful shutdown =====================
function shutdown(signal: string) {
  console.log(`\n⏹️  ${signal} received — shutting down gracefully`);
  server.close(() => {
    pool.end().then(() => {
      console.log('✅ Database pool closed');
      process.exit(0);
    });
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled rejection:', reason);
});

export default app;
