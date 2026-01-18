import { z } from 'zod';
import { insertTutorialSchema, tutorials } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tutorials: {
    list: {
      method: 'GET' as const,
      path: '/api/tutorials',
      input: z.object({
        search: z.string().optional(),
        style: z.string().optional(),
        difficulty: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof tutorials.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tutorials/:id',
      responses: {
        200: z.custom<typeof tutorials.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tutorials',
      input: insertTutorialSchema,
      responses: {
        201: z.custom<typeof tutorials.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.internal, // Unauthorized
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type TutorialInput = z.infer<typeof api.tutorials.create.input>;
