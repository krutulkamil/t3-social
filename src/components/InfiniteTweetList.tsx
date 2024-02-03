import React from 'react';
import type { Tweet } from '~/types/tweet';

interface InfiniteTweetListProps {
  tweets?: Tweet[];
  isError: boolean;
  isLoading: boolean;
  hasMore?: boolean;
  fetchNewTweets: () => Promise<unknown>;
}

export function InfiniteTweetList({ tweets, isError, isLoading, hasMore, fetchNewTweets }: InfiniteTweetListProps) {
  return (
    <div>
      <div>{JSON.stringify(tweets, null, 4)}</div>
    </div>
  );
}
