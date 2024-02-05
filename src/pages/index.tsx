import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

import { NewTweetFormWrapper } from '~/components/tweet/NewTweetFormWrapper';
import { RecentTweets } from '~/components/tweet/RecentTweets';
import { FollowingTweets } from '~/components/tweet/FollowingTweets';

const TABS = ['Recent', 'Following'] as const;
type Tab = (typeof TABS)[number];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<Tab>('Recent');
  const session = useSession();

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === 'authenticated' && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                    tab === selectedTab ? 'border-b-4 border-b-blue-500 font-bold' : ''
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <NewTweetFormWrapper />
      {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
    </>
  );
}
