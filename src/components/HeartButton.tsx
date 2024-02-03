import React from 'react';
import { VscHeart, VscHeartFilled } from 'react-icons/vsc';
import { useSession } from 'next-auth/react';
import type { Tweet } from '~/types/tweet';

interface HeartButtonProps {
  likedByMe: Tweet['likedByMe'];
  likeCount: Tweet['likeCount'];
}

export function HeartButton({ likedByMe, likeCount }: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== 'authenticated') {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-gray-500">
        <HeartIcon />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-red-500 focus-visible:text-red-500'
      }`}
    >
      <HeartIcon
        className={`transition-colors duration-200 ${likedByMe ? 'fill-red-500' : 'group-hover:fill-500 fill-gray-500 group-focus-visible:fill-red-500'}`}
      />
      <span>{likeCount}</span>
    </button>
  );
}
