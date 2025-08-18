"use client";
import { backend_url } from "@/lib/constants";
import { User } from "@/lib/user.entity";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBuilding } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { MdDelete, MdEmail } from "react-icons/md";
import { TiPhone, TiTick } from "react-icons/ti";

const Approval = () => {
  const { data: session } = useSession();
  const [buyersToApprove, setBuyersToApprove] = useState<User[] | undefined>();
  const [selectedBuyer, setSelectedBuyer] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBuyers = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${backend_url}/api/users/to-be-approved`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${session?.backendTokens.accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch buyers: ${res.statusText}`);
        }

        const data = await res.json();
        setBuyersToApprove(data);
      } catch (e: any) {
        console.error(e);
        setError("Error fetching buyers to approve. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, [session]);

  async function approveBuyer(email: string) {
    try {
      const res = await fetch(`${backend_url}/api/users/approve/${email}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to approve buyer: ${res.statusText}`);
      }

      router.push("/admin");
    } catch (e: any) {
      console.error(e);
      setError("Error fetching buyers to approve. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBuyer(email: string) {
    try {
      const res = await fetch(`${backend_url}/api/users/delete/${email}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete buyer: ${res.statusText}`);
      }

      router.push("/admin");
    } catch (e: any) {
      console.error(e);
      setError("Error fetching buyers to approve. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full gap-5">
      <div className="w-1/5 bg-[#195839] rounded-md h-200">
        <div className="text-center bg-[#003C24] py-2 text-xl">
          Select Buyer
        </div>

        <div className="m-1">
          {buyersToApprove?.map((buyer) => (
            <div
              className={"bg-gradient-to-t from-green-800 to-green-900 py-1 text-center hover:from-green-900 hover:to-green-950 cursor-pointer mb-1"+ (buyer.email === selectedBuyer?.email ? ' from-green-900 to-green-950' : '')}
              onClick={() => setSelectedBuyer(buyer)}
              key={buyer.email}
            >
              <p>{buyer.name}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedBuyer && (
        <div className="w-3/5 flex justify-center items-center">
          <div className="m-2 flex-col justify-center">
            <div className="flex items-center gap-2 text-3xl">
              <FaBuilding className="text-green-500 text-3xl" />
              <h2>{selectedBuyer.name}</h2>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <TiPhone className="text-green-500 text-xl" />
                <p>{selectedBuyer.phone}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <MdEmail className="text-green-500 text-xl" />
                <p>{selectedBuyer.email}</p>
              </div>
            </div>
            {selectedBuyer.urlToDoc && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <FaRegFileLines className="text-green-500 text-xl" />
                  <Link href={selectedBuyer.urlToDoc}>see document</Link>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-1 cursor-pointer">
                <TiTick className="text-blue-500 text-xl" />
                <p
                  className="text-blue-500"
                  onClick={() => approveBuyer(selectedBuyer.email)}
                >
                  Approve
                </p>
              </div>
              <div className="flex items-center gap-1 cursor-pointer">
                <MdDelete className="text-red-500 text-xl" />
                <p
                  className="text-red-500"
                  onClick={() => deleteBuyer(selectedBuyer.email)}
                >
                  Delete
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
