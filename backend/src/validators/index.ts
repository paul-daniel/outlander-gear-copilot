import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
  first_name: z.string().min(1, 'Prénom requis').max(100),
  last_name: z.string().min(1, 'Nom requis').max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const cartItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1, 'Quantité minimum : 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantité minimum : 1'),
});

export const createOrderSchema = z.object({
  shipping_address: z.string().min(5, 'Adresse requise'),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().optional(),
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  featured: z.coerce.boolean().optional(),
  tags: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name', 'newest', 'rating']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
