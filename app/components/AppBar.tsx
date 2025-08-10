import Link from "next/link";
import React from "react";
import TopBarButtons from "./TopBarButtons";

const AppBar = () => {
  return (
    <header className="fixed top-0 z-10 w-full shadow">
      <div className="flex items-center justify-between h-14  bg-[#22734B] px-4 rounded">
        <Link className="text-2xl font-semibold text-green-100" href="/tenders">
          Teletender
        </Link>
        <TopBarButtons />
      </div>
    </header>
  );
};

export default AppBar;
