"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ButtonAccount from "./ButtonAccount";

const Navbar = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // Or a loading spinner
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <nav className="max-w-7xl mx-auto bg-blue-100 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 px-8 py-8 lg:py-2">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-center">
        <Link href="/">
          <span className="text-lg font-bold">Home</span>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center">
        <span className="text-lg">Hello, {session.user.name}</span>
        <ButtonAccount />
        {/* <button onClick={() => signOut()} className="btn btn-primary">
          Sign Out
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
