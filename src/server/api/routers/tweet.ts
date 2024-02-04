import { z } from 'zod';
import { type Prisma } from '@prisma/client';
import { type inferAsyncReturnType } from '@trpc/server';

import { type createTRPCContext, createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc';

export const tweetRouter = createTRPCRouter({
  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ input: { limit = 10, userId, cursor }, ctx }) => {
      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause: { userId },
      });
    }),

  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional(),
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ input: { limit = 10, onlyFollowing = false, cursor }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      return await getInfiniteTweets({
        limit,
        ctx,
        cursor,
        whereClause:
          onlyFollowing && currentUserId ? { user: { followers: { some: { id: currentUserId } } } } : undefined,
      });
    }),

  create: protectedProcedure.input(z.object({ content: z.string() })).mutation(async ({ input: { content }, ctx }) => {
    const tweet = await ctx.db.tweet.create({
      data: { content, userId: ctx.session.user.id },
    });

    void ctx.revalidateSSG?.(`profiles/${ctx.session.user.id}`);
    return tweet;
  }),

  toggleLike: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input: { id }, ctx }) => {
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

interface InfiniteTweetsInput {
  whereClause?: Prisma.TweetWhereInput;
  ctx: inferAsyncReturnType<typeof createTRPCContext>;
  limit: number;
  cursor?: { id: string; createdAt: Date };
}

async function getInfiniteTweets({ whereClause, ctx, limit, cursor }: InfiniteTweetsInput) {
  const currentUserId = ctx.session?.user.id;

  const data = await ctx.db.tweet.findMany({
    take: limit + 1,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    where: whereClause,
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
}
