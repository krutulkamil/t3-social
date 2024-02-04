import React, { useCallback, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';
import { updateTextAreaSize } from '~/utils/updateTextAreaSize';
import { ProfileImage } from '~/components/ProfileImage';
import { Button } from '~/components/Button';
import { api } from '~/utils/api';
import type { SessionContextValue } from 'next-auth/react';
import type { Session } from 'next-auth';

interface NewTweetFormProps {
  sessionStatus: SessionContextValue['status'];
  sessionData: Session;
}

export function NewTweetForm({ sessionStatus, sessionData }: NewTweetFormProps) {
  const [inputValue, setInputValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement | undefined>(undefined);
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  const trpcUtils = api.useUtils();

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInputValue('');

      if (sessionStatus !== 'authenticated') return;

      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData?.pages[0]) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: sessionData.user.id,
            name: sessionData.user.name ?? null,
            image: sessionData.user.image ?? null,
          },
        };

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });

  function handleTextAreaValue(event: ChangeEvent<HTMLTextAreaElement>) {
    return setInputValue(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createTweet.mutate({ content: inputValue });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex gap-4">
        <ProfileImage src={sessionData.user.image} />
        <textarea
          value={inputValue}
          ref={inputRef}
          onChange={handleTextAreaValue}
          style={{ height: 0 }}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        />
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}
