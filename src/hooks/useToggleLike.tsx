import { api } from '~/utils/api';
import { type Tweet } from '~/types/tweet';

export function useToggleLike(id: string, user: Tweet['user']) {
  const utils = api.useUtils();

  const { mutate, isLoading } = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<typeof utils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (!oldData) return;

        const countModifier = addedLike ? 1 : -1;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }

                return tweet;
              }),
            };
          }),
        };
      };

      utils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      utils.tweet.infiniteFeed.setInfiniteData({ onlyFollowing: true }, updateData);
      utils.tweet.infiniteProfileFeed.setInfiniteData({ userId: user.id }, updateData);
    },
  });

  return { toggleLikeMutate: mutate, isToggleLikeLoading: isLoading };
}
