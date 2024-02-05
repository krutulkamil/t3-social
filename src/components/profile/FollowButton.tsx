import React from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '~/components/layout/Button';

interface FollowButtonProps {
  userId: string;
  onClick: () => void;
  isFollowing: boolean;
  isLoading: boolean;
}

export function FollowButton({ userId, onClick, isFollowing, isLoading }: Readonly<FollowButtonProps>) {
  const session = useSession();

  if (session.status !== 'authenticated' || session.data.user.id === userId) {
    return null;
  }

  return (
    <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
