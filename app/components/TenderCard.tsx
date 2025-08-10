'use client'
import { backend_url } from "@/lib/constants";
import { Tender } from "@/lib/tender.entity";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";

const TenderCard = ( props : {tender: Tender} ) => {
  const { data: session } = useSession();
  const [company, setCompany] = useState<User>();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
      if (!session?.backendTokens?.accessToken) {
        setLoading(false); // Stop loading if there's no session
        return;
      }
  
      const fetchTenders = async () => {
        setLoading(true);
  
        try {
          const res = await fetch(`${backend_url}/api/users/${props.tender.organizationId}`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${session.backendTokens.accessToken}`,
            }
          });
  
          if (!res.ok) {
            throw new Error(`Failed to fetch tenders: ${res.statusText}`);
          }
  
          const data = await res.json();
          setCompany(data);
        } catch (e: any) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTenders();
    }, [session])


    return (
        <div className='bg-emerald-900 w-full rounded-sm shadow-sm p-2 mb-4 hover:bg-emerald-800'>
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-1 ml-2">
                    <FaBuilding className="text-green-500"/>
                    <h2 className='font-semibold text-xl text-green-600'>{company?.name}</h2>
                </div>
                <div className="flex items-center gap-1 text-sm mr-2 text-green-200">
                    <MdCalendarMonth />
                    <p > from { new Date(props.tender.openAt).toLocaleDateString()}, {new Date(props.tender.openAt).toLocaleTimeString()} to {new Date(props.tender.closeAt).toLocaleDateString()}, {new Date(props.tender.closeAt).toLocaleTimeString()}</p>
                </div>
            </div>
            <p className="text-sm p-2">
                {props.tender.details}
            </p>
            <div className='flex justify-between items-center'>
                <p></p>
                    <Link href={`tenders/${props.tender.id}`} className="text-green-600 text-md hover:text-green-100">See details</Link>
                </div>
        </div>
    );
};

export default TenderCard;