"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { CiSquarePlus } from "react-icons/ci";

const TopBarButtons = () => {
  const { data: session } = useSession();
  console.log({ session });

  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto">
        {session.user.role !== "VENDOR" && (
          <Link href={"/tenders/new"} className="text-white font-bold">
            <CiSquarePlus className="font-bold text-3xl text-white" />
          </Link>
        )}
        {session.user.role === "ADMIN" && (
          <Link href={"/admin"} className="text-white font-bold">
            <p>Dashboard</p>
          </Link>
        )}
        <Link href="/profile" className="text-sky-600">
          {session.user.name}{" "}
        </Link>
        <Link
          href={"/api/auth/signout"}
          className="flex gap-4 ml-auto text-red-600"
        >
          Sign Out
        </Link>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center">
      <Link
        href={"/api/auth/signin"}
        className="flex gap-4 ml-auto text-green-600"
      >
        Sign In
      </Link>
      <Link
        href={"/signup"}
        className="flex gap-4 ml-auto bg-green-600 text-green-200 p-2 rounded"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default TopBarButtons;
