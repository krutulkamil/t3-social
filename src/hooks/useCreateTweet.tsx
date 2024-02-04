import { useSession } from 'next-auth/react';
import { api } from '~/utils/api';

export function useCreateTweet(callback: () => void) {
  const session = useSession();
  const utils = api.useUtils();

  const { mutate } = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      callback();

      if (session.status !== 'authenticated') return;

      utils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name ?? null,
            image: session.data.user.image ?? null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  return { createTweetMutate: mutate }
}