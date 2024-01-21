import { type ChangeEvent, useCallback, useLayoutEffect, useRef, useState } from "react";
import { updateTextAreaSize } from "~/utils/updateTextAreaSize";
import { ProfileImage } from "~/components/ProfileImage";
import { Button } from "~/components/Button";
import type { SessionContextValue } from "next-auth/react";
import type { Session } from "next-auth";

interface NewTweetFormProps {
  sessionStatus: SessionContextValue["status"];
  sessionData: Session;
}

export function NewTweetForm({ sessionStatus, sessionData }: NewTweetFormProps) {
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | undefined>(undefined);
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {

    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  if (sessionStatus !== "authenticated") return;

  function handleTextAreaValue(event: ChangeEvent<HTMLTextAreaElement>) {
    return setInputValue(event.target.value);
  }

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
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
