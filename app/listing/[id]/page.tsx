'use client'
import { useSession } from "next-auth/react";
import  TenderCard  from '@/app/components/TenderCard'
import React from 'react'

const TenderDetails = () => {
    const { data: session } = useSession();
    console.log({ session });

    if (session && session.user)
    { return (
        <div>{session?.user.name}</div>
    )}
    else {
        return  (
            <>
                <div className="m-4">
                    <TenderCard />
                </div>
            </>
        )
    }
}

export default TenderDetails