import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const tweetRouter = createTRPCRouter({
  infiniteFeed: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      return ctx.db.tweet.findMany({
        take: limit + 1,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        cursor: cursor ? { createdAt_id: cursor } : undefined,
      });
    }),

  create: protectedProcedure.input(z.object({ content: z.string() })).mutation(async ({ input: { content }, ctx }) => {
    return ctx.db.tweet.create({
      data: { content, userId: ctx.session.user.id },
    });
  }),
});
