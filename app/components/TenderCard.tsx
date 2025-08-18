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
  const [timeString, setTimeString] = useState('');

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


      const getRelativeTime = () => {
    // Get the current time and the post's update time
    const now = new Date();
    const updatedDate = new Date(props.tender.updatedAt);
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = now.getTime() - updatedDate.getTime();
    // Convert to seconds
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    // Convert to minutes
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    // Convert to hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    // Convert to days
    const diffInDays = Math.floor(diffInHours / 24);

    // Logic to determine the correct string to display
    if (diffInMinutes < 2) {
      return 'just now';
    } else if (diffInHours < 1) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 2) {
      return 'yesterday';
    } else {
      // Fallback to the full date and time if it's more than a day
      return `${updatedDate.toLocaleDateString()}`;
    }
  };

  useEffect(() => {
    setTimeString(getRelativeTime());
  }, [props.tender.updatedAt]);

    return (
        <div className='bg-[#164B30] w-full rounded-sm shadow-sm sm:p-2 mb-2 hover:bg-[#22734B]'>
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-1 ml-2">
                    <FaBuilding className="text-green-500"/>
                    <h2 className='font-semibold sm:text-xl text-green-600'>{company?.name}</h2>
                </div>
                <div className="sm:flex items-center gap-1 text-sm hidden mr-2 text-green-200">
                    <MdCalendarMonth />
                    <p > from { new Date(props.tender.openAt).toLocaleDateString()}, {new Date(props.tender.openAt).toLocaleTimeString()} to {new Date(props.tender.closeAt).toLocaleDateString()}, {new Date(props.tender.closeAt).toLocaleTimeString()}</p>
                </div>
            </div>
            <p className="text-m p-2">
                {props.tender.details}
            </p>
            <div className='flex justify-between items-center'>
                     <p className="text-green-200 ml-2 text-xs">{timeString}</p>
                    <Link href={`tenders/${props.tender.id}`} className="text-green-600 text-md hover:text-green-100">See details</Link>
                </div>
        </div>
    );
};

export default TenderCard;