import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

const AppBar = () => {
    return (
        <header className="flex gap-4 px-4 h-14 items-center bg-[#059F5F] shadow top-0 fixed w-full">
            <h2 className='text-2xl font-semibold text-green-100'>Tenders</h2>
            <SignInButton />
        </header>
    );
};

export default AppBar;