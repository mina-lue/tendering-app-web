'use client'
import { backend_url } from "@/lib/constants";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from "next/navigation";
import { Tender } from "@/lib/tender.entity";
import PayForDocButton from "@/app/components/PayForDocButton";
import { MdOutlineBackspace } from "react-icons/md";

const TenderDetails = () => {
    const { data: session } = useSession();
    const [tender, setTender ] = useState<Tender>();
    const [buyer, setBuyer ] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const tenderId = params.id;
    const router = useRouter();

    useEffect(() =>{
        if (!session?.backendTokens?.accessToken) {
      setLoading(false); // Stop loading if there's no session
      return;
    }

    const fetchTenders = async () => {
      setLoading(true);
      setError(null);

     try {
            const res = await fetch(`${backend_url}/api/tenders/${tenderId}`, {
              method: "GET",
              headers: {
                authorization: `Bearer ${session?.backendTokens.accessToken}`,
              }
            });
    
            if (!res.ok) {
              throw new Error(`Failed to fetch tenders: ${res.statusText}`);
            }
    
            const data = await res.json();
            setTender(data);
          } catch (e: any) {
            console.error(e);
            setError('Error fetching tenders. Please try again later.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchTenders();
      }, [session]);



    if (session && session.user && tender)
    { return (
          
          <div className="bg-[#164B30] p-4 sm:mx-2  min-h-200 rounded-md">
           <div className="mb-2"> 
            <MdOutlineBackspace className="float-right text-red-600 sm:text-3xl" onClick={() => router.back()} />
          </div>
            <div>
              <div className="flex justify-between">
                <p className="sm:text-3xl text-xl ml-4 text-green-50 pt-4">{session?.user.name}</p>
                <div className="mt-4 rounded">
                    <p className="text-green-100 text-xs sm:text-xl bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">opening date: { new Date(tender.openAt).toLocaleDateString()}, {new Date(tender.openAt).toLocaleTimeString()}</p>
                    <p className="text-green-100 text-xs sm:text-xl bg-gradient-to-t from-green-800 to-green-900 px-2 py-1">closing date: { new Date(tender.closeAt).toLocaleDateString()}, {new Date(tender.closeAt).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="p-5">
                <p className="text-green-50 text-xl">{tender.details}</p>
            </div>
            <div className="mt-4 flex w-full justify-center">
                <div className="w-fit right-0 flex gap-3">
                    {tender.document_buy_option && tender.documentPrice && <PayForDocButton  amount={tender.documentPrice} />}
                    
                </div>
            </div>
            </div>
        </div>
    )}
    else {
        return  (
            <>
                <div className="m-4">
                    Tender Details Page
                </div>
            </>
        )
    }
}

export default TenderDetails