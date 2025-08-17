'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { backend_url } from '@/lib/constants';
import { MdDelete } from 'react-icons/md';
import { TenderResponsesForAdmin } from '@/lib/tender.entity';
import { useRouter } from 'next/navigation';

const TenderListAdmin = () => {

  const { data: session } = useSession();
  const [tenders, setTenders] = useState<TenderResponsesForAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const deleteTender = async (id : number) => {
     if (!session?.backendTokens?.accessToken) return;
    
        try {
          const res = await fetch(`${backend_url}/api/tenders/${id}`, {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${session.backendTokens.accessToken}`,
            },
          });
    
          if (!res.ok) {
            throw new Error(`Failed to delete tender: ${res.statusText}`);
          }
    
          setTenders((prev) => prev.filter((tender) => tender.id !== id));
        } catch (e: any) {
          console.error(e);
          setError("Error deleting tender. Please try again later.");
        }
  };

  useEffect(()=>{
      if (!session?.backendTokens?.accessToken) {
        setLoading(false); 
        return;
      }
  
      const fetchTenders = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const res = await fetch(`${backend_url}/api/tenders/all`, {
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
          setError("Error fetching users. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchTenders();
    }, [session]);


  return (
    <article className={cn("rounded-xl p-4 mx-2")}>
      <div className='flex justify-between'>
      <h2 className="font-bold text-3xl mb-4">All Tenders</h2>
      </div>
      <Table className='rounded-md'>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg bg-green-900 rounded-tl-xl">Buyer</TableHead>
            <TableHead className="text-lg bg-green-900 w-2/5">Tender</TableHead>
            <TableHead className="text-lg text-right bg-green-900">posted at</TableHead>
            <TableHead className="text-lg text-right bg-green-900 rounded-tr-xl">delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders?.map(({ id, details, updatedAt, organization }) => (
            <TableRow key={id}>
              <TableCell>
                  <div className="flex items-center gap-2">
                      <p className="text-xl">{organization.name}</p>
                  </div>
              </TableCell>
             <TableCell
             onClick={() => router.push(`/tenders/${id}`)}
             >
              <div className="overflow-hidden cursor-pointer">
                {details}
              </div>
              </TableCell> 
              <TableCell>
                <div className="flex items-center justify-end">
                  {(new Date(updatedAt)).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
              <div className="flex justify-end w-full">
                <MdDelete className='text-2xl text-orange-800 cursor-pointer' onClick={() => {deleteTender(id)}} />
              </div>
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  )
}

export default TenderListAdmin