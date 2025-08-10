"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function SignOutPage() {
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Sign out</h1>
      <p>Are you sure you want to sign out?</p>
      <div className="space-x-2">
        <button
          className="px-4 py-2 rounded bg-black text-white cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/signin" })}
        >
          Yes, sign me out
        </button>
        <Link href="/tenders" className="px-4 py-2 rounded border">Cancel</Link>
      </div>
    </main>
  );
}
