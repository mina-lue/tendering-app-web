'use client'

import { useSession } from "next-auth/react";
import  TenderCard  from '@/app/components/TenderCard'
import React, { useEffect, useState } from 'react'
import { backend_url } from "@/lib/constants";
import { Tender } from "@/lib/tender.entity";

const ListingPage = () => {
  const { data: session } = useSession();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(()=>{
    if (!session?.backendTokens?.accessToken) {
      setLoading(false); // Stop loading if there's no session
      return;
    }

    const fetchTenders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${backend_url}/api/tenders/recent`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${session.backendTokens.accessToken}`,
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch tenders: ${res.statusText}`);
        }

        const data = await res.json();
        setTenders(data);
      } catch (e: any) {
        console.error(e);
        setError("Error fetching tenders. Please try again later.");
        // alert("Error fetching tender"); // Consider using a more user-friendly error display
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [session]);


  if (loading) {
    return <div className="p-4">Loading tenders...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  
  if (tenders.length === 0) {
      return <div className="p-4">No tenders found.</div>;
  }

  return (
    <div className="m-4">
      {tenders.map((tender: any) => (
        <TenderCard key={tender.id} tender={tender} />
      ))}
    </div>
  );
}

export default ListingPage