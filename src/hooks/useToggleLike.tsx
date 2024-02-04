import { api } from '~/utils/api';

export function useToggleLike(id: string) {
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
    },
  });

  return { toggleLikeMutate: mutate, isToggleLikeLoading: isLoading };
}
