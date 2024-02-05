import React from 'react';
import { InfiniteTweetList } from '~/components/tweet/InfiniteTweetList';
import { api } from '~/utils/api';

export function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery({}, { getNextPageParam: (lastPage) => lastPage.nextCursor });
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
