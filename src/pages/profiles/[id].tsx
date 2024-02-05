import Head from 'next/head';
import Link from 'next/link';
import ErrorPage from 'next/error';
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next';
import { VscArrowLeft } from 'react-icons/vsc';
import { IconHoverEffect } from '~/components/layout/IconHoverEffect';
import { ProfileImage } from '~/components/profile/ProfileImage';
import { FollowButton } from '~/components/profile/FollowButton';
import { InfiniteTweetList } from '~/components/tweet/InfiniteTweetList';
import { api } from '~/utils/api';
import { useToggleFollow } from '~/hooks/useToggleFollow';
import { ssgHelper } from '~/server/api/ssgHelper';
import { getPlural } from '~/utils/getPlural';

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ id }) => {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const tweets = api.tweet.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const { toggleFollowMutate, isToggleFollowLoading } = useToggleFollow(id);

  if (!profile?.name) return <ErrorPage statusCode={404} />;

  return (
    <>
      <Head>
        <title>{`Twitter Clone - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-6 w-6" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.tweetsCount} {getPlural(profile.tweetsCount, 'Tweet', 'Tweets')} - {profile.followersCount}{' '}
            {getPlural(profile.followersCount, 'Follower', 'Followers')} - {profile.followsCount} Following
          </div>
        </div>
        <FollowButton
          isFollowing={profile.isFollowing}
          isLoading={isToggleFollowLoading}
          userId={id}
          onClick={() => toggleFollowMutate({ userId: id })}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
          isError={tweets.isError}
          isLoading={tweets.isLoading}
          hasMore={tweets.hasNextPage}
          fetchNewTweets={tweets.fetchNextPage}
        />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
  const id = context.params?.id;

  if (!id) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;
