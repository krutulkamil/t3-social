import Link from "next/link";
import { useSession, signOut, signIn } from "next-auth/react";

export function SideNav() {
  const session = useSession();
  const { status, data } = session;

  const isAuthenticated = status === 'authenticated';

  return (
    <nav className="sticky top-0 px-2 py-4">
      <ul className="flex flex-col items-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/" passHref>Home</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link href={`/profiles/${data?.user.id}`} passHref>Profile</Link>
          </li>
        )}
        {isAuthenticated ? (
          <li>
            <button onClick={() => signOut()}>Logout</button>
          </li>
          )  : (
          <li>
            <button onClick={() => signIn()}>Log In</button>
          </li>
        )}
      </ul>
    </nav>
  );
}