import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // Zod validation errors — centralized so routes don't repeat this
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Données invalides', details: err.errors });
    return;
  }

  // PostgreSQL unique constraint violation
  if ((err as any).code === '23505') {
    res.status(409).json({ error: 'Cette ressource existe déjà' });
    return;
  }

  // Log full stack trace for debugging (never expose to client)
  console.error('❌ Unhandled error:', env.nodeEnv === 'development' ? err.stack : err.message);

  res.status(500).json({ error: 'Erreur interne du serveur' });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Route non trouvée' });
}
