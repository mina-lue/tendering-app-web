import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

const AppBar = () => {
    return (
        <header className="flex gap-4 px-4 h-14 items-center bg-[#22734B] shadow top-0 fixed w-full">
            <Link className='text-2xl font-semibold text-green-100' href="/tenders">Tenders</Link>
            <SignInButton />
        </header>
    );
};

export default AppBar;