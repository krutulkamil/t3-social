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
      const currentUserId = ctx.session?.user.id;

      const data = await ctx.db.tweet.findMany({
        take: limit + 1,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        cursor: cursor ? { createdAt_id: cursor } : undefined,
        select: {
          id: true,
          content: true,
          createdAt: true,
          _count: { select: { likes: true } },
          likes: currentUserId ? { where: { userId: currentUserId } } : false,
          user: { select: { name: true, id: true, image: true } },
        },
      });

      let nextCursor: typeof cursor | undefined;
      if (data.length > limit) {
        const nextItem = data.pop();
        if (nextItem) {
          nextCursor = { id: nextItem.id, createdAt: nextItem.createdAt };
        }
      }

      const tweets = data.map((tweet) => {
        return {
          id: tweet.id,
          content: tweet.content,
          createdAt: tweet.createdAt,
          likeCount: tweet._count.likes,
          user: tweet.user,
          likedByMe: tweet.likes?.length > 0,
        };
      });

      return { tweets, nextCursor };
    }),

  create: protectedProcedure.input(z.object({ content: z.string() })).mutation(async ({ input: { content }, ctx }) => {
    return ctx.db.tweet.create({
      data: { content, userId: ctx.session.user.id },
    });
  }),

  toggleLike: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input: { id }, ctx }) => {
    const data = { tweetId: id, userId: ctx.session.user.id };

    const existingLike = await ctx.db.like.findUnique({
      where: { userId_tweetId: data },
    });

    if (!existingLike) {
      await ctx.db.like.create({ data });
      return { addedLike: true };
    } else {
      await ctx.db.like.delete({ where: { userId_tweetId: data } });
      return { addedLike: false };
    }
  }),
});
