import React from 'react';
import Link from 'next/link';
import { api } from '~/utils/api';
import { ProfileImage } from '~/components/ProfileImage';
import { HeartButton } from '~/components/HeartButton';
import { dateTimeFormatter } from '~/utils/dateTimeFormatter';
import type { Tweet } from '~/types/tweet';

export function TweetCard({ id, user, content, createdAt, likeCount, likedByMe }: Tweet) {
  const trpcUtils = api.useUtils();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<typeof trpcUtils.tweet.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData == null) return;

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

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
    },
  });

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }

  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="outline:none font-bold hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">-</span>
          <span className="text-gray-500">{dateTimeFormatter.format(createdAt)}</span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <HeartButton
          likeCount={likeCount}
          likedByMe={likedByMe}
          onClick={handleToggleLike}
          isLoading={toggleLike.isLoading}
        />
      </div>
    </li>
  );
}
