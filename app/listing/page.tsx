'use client'
import { useSession } from "next-auth/react";
import React from 'react'

const ListingPage = () => {
  const { data: session } = useSession();
  console.log({ session });

  if (session && session.user)
 { return (
    <div>{session?.user.name}</div>
  )}
  else {
    return  <div> No name</div>
  }
}

export default ListingPage