import { api } from '~/utils/api';

export function useToggleFollow(id: string) {
  const utils = api.useUtils();

  const { mutate, isLoading } = api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      utils.profile.getById.setData({ id }, (oldData) => {
        if (!oldData) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        }
      });
    },
  });

  return { toggleFollowMutate: mutate, isToggleFollowLoading: isLoading };
}
