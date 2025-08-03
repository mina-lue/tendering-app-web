'use client'
import { useSession } from "next-auth/react";
import  TenderCard  from '@/app/components/TenderCard'
import React from 'react'

const ListingPage = () => {
  const { data: session } = useSession();
  console.log({ session });

    return  (
        <>
        <div className="m-4">
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
            <TenderCard />
        </div>
        </>
    )
}

export default ListingPage