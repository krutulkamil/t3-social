import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TweetCard } from '~/components/TweetCard';
import type { Tweet } from '~/types/tweet';

interface InfiniteTweetListProps {
  tweets?: Tweet[];
  isError: boolean;
  isLoading: boolean;
  hasMore?: boolean;
  fetchNewTweets: () => Promise<unknown>;
}

export function InfiniteTweetList({ tweets, isError, isLoading, hasMore = false, fetchNewTweets }: InfiniteTweetListProps) {
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error...</h1>;
  if (!tweets || tweets.length === 0) {
    return <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>;
  }

  return (
    <ul>
      <InfiniteScroll next={fetchNewTweets} hasMore={hasMore} loader="Loading..." dataLength={tweets.length}>
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}