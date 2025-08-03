import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";

const AppBar = () => {
    return (
        <header className="flex gap-4 p-4 bg-[#059F52] shadow top-0 fixed w-full">
            <h2 className='text-2xl font-semibold'>Tenders</h2>
            <SignInButton />
        </header>
    );
};

export default AppBar;