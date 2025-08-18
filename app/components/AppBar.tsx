import Link from "next/link";
import React from "react";
import TopBarButtons from "./TopBarButtons";
import Image from "next/image";

const AppBar = () => {
  return (
    <header className="fixed top-3 z-10 shadow sm:mx-12 mx-2 w-[95%]">
      <div className="flex items-center justify-between h-14  bg-[#22734B] px-4 rounded">
        <Link className="text-2xl font-semibold text-green-100" href="/tenders">
          <Image src='/favicon.svg' alt='Teletender' width={40} height={20} className="rounded-full"/>
        </Link>
        <TopBarButtons />
      </div>
    </header>
  );
};

export default AppBar;
