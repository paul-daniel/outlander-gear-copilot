/**
 * Application-wide environment configuration.
 *
 * All backend URLs and feature flags live here so they
 * can be changed in one place instead of scattered across services.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
} as const;
