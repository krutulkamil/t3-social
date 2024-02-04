import React, { useCallback, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';
import { updateTextAreaSize } from '~/utils/updateTextAreaSize';
import { ProfileImage } from '~/components/ProfileImage';
import { Button } from '~/components/Button';
import { useCreateTweet } from '~/hooks/useCreateTweet';
import type { Session } from 'next-auth';

interface NewTweetFormProps {
  sessionData: Session;
}

export function NewTweetForm({ sessionData }: NewTweetFormProps) {
  const [inputValue, setInputValue] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement | undefined>(undefined);
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  function onCreateTweetSuccess() {
    setInputValue('');
  }

  const { createTweetMutate } = useCreateTweet(onCreateTweetSuccess);

  function handleTextAreaValue(event: ChangeEvent<HTMLTextAreaElement>) {
    return setInputValue(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createTweetMutate({ content: inputValue });
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
