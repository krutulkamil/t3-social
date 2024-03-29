import React from "react";
import { useSession } from "next-auth/react";
import { NewTweetForm } from "~/components/tweet/NewTweetForm";

export function NewTweetFormWrapper() {
  const session = useSession();
  const { status, data } = session;

  if (status !== "authenticated") return;

  return <NewTweetForm sessionData={data} />;
}
