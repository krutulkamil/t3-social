import { ProfileImage } from "~/components/ProfileImage";
import { useSession } from "next-auth/react";

export function NewTweetForm() {
  const session = useSession();

  const { data } = session;

  return (
    <form className="flex flex-col gap-2 border-b px-4 py-2">
      <div className="flex gap-4">
        <ProfileImage src={data?.user?.image} />
      </div>
      <button className="self-end">Tweet</button>
    </form>
  );
}
