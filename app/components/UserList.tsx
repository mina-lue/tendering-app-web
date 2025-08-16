'use client'
import Link from 'next/link'
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
import { UserResponse } from '@/lib/user.entity';

const UserList = () => {

  const { data: session } = useSession();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const blockUser = async (id: number) => {
    if (!session?.backendTokens?.accessToken) return;

    try {
      const res = await fetch(`${backend_url}/api/users/block/${id}`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session.backendTokens.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to block user: ${res.statusText}`);
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (e: any) {
      console.error(e);
      setError("Error blocking user. Please try again later.");
    }
  };

  const deleteUser = async (id : number) => {
    if (!session?.backendTokens?.accessToken) return;

    try {
      const res = await fetch(`${backend_url}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session.backendTokens.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete user: ${res.statusText}`);
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (e: any) {
      console.error(e);
      setError("Error deleting user. Please try again later.");
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
          const res = await fetch(`${backend_url}/api/users`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${session.backendTokens.accessToken}`,
            }
          });
  
          if (!res.ok) {
            throw new Error(`Failed to fetch tenders: ${res.statusText}`);
          }
  
          const data = await res.json();
          setUsers(data);
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
      <h2 className="font-bold text-3xl mb-4">My Users</h2>
      </div>
      <Table className='rounded-md'>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg bg-green-900 rounded-tl-xl w-2/5">Name</TableHead>
            <TableHead className="text-lg bg-green-900 ">phone</TableHead>
            <TableHead className="text-lg text-right bg-green-900">email</TableHead>
            <TableHead className="text-lg text-right bg-green-900">role</TableHead>
            <TableHead className="text-lg text-right bg-green-900">suspend</TableHead>
            <TableHead className="text-lg text-right bg-green-900 rounded-tr-xl">delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(({ id, name, phone, email, role }) => (
            <TableRow key={id}>
              <TableCell>
                  <div className="flex items-center gap-2">
                      <p className="text-xl">{name}</p>
                  </div>
              </TableCell>
             <TableCell>
              <div className="subject-badge">
                {phone}
              </div>
              
              </TableCell> 
              <TableCell>
                <div className="flex items-center justify-end">
                  {email}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  {role}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                <p className='p-1 px-2 bg-amber-700 rounded-xl cursor-pointer' onClick={() => {blockUser(id)}}>block</p>
                </div>
              </TableCell>
              <TableCell>
              <div className="flex justify-end w-full">
                <MdDelete className='text-2xl text-orange-800 cursor-pointer' onClick={() => {deleteUser(id)}} />
              </div>
              </TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  )
}

export default UserList