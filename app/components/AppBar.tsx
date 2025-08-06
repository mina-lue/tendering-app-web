import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

const AppBar = () => {
  return (
    <header className="fixed top-0 z-10 w-full shadow">
      <div className="flex items-center justify-between h-14  bg-[#22734B] mx-4 mt-4 px-4 rounded">
        <Link className="text-2xl font-semibold text-green-100" href="/tenders">
          Tenders
        </Link>
        <SignInButton />
      </div>
    </header>
  );
};

export default AppBar;
