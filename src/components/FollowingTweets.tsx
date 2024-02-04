import React from 'react';
import { api } from '~/utils/api';
import { InfiniteTweetList } from '~/components/InfiniteTweetList';

export function FollowingTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({ onlyFollowing: true }, { getNextPageParam: (lastPage) => lastPage.nextCursor });
  const tweetsData = tweets.data?.pages.flatMap((page) => page.tweets);

  return (
    <InfiniteTweetList
      tweets={tweetsData}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}