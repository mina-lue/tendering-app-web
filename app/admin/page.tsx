'use client'
import React from 'react'
import Approval from '../components/Approval'
import UserList from '../components/UserList'
import TenderListAdmin from '../components/TenderListAdmin'
import SubscribePage from '../components/SubscripePage'

const Dashboard = () => {

  const [tab, setTab] = React.useState<"Summary" | "Users" | "Tenders" | "Payments" | "Approval">("Summary");

  return (
    <div className='flex w-full p-4 gap-2 items-center justify-center'>
        <div className='bg-[#22734B] h-200 w-1/6 rounded-sm p-2 flex justify-center'>
            <div className='w-full flex-col gap-y-2 justify-center'>
                <p className={'bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950' + (tab === "Approval" ? ' bg-green-950' : '')} onClick={() => setTab("Approval")}>Approve Buyers</p>
                <p className={'bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950' + (tab === "Users" ? ' bg-green-950' : '')} onClick={() => setTab("Users")}>Manage Users</p>
                <p className={'bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950' + (tab === "Tenders" ? ' bg-green-950' : '')} onClick={() => setTab("Tenders")}>Manage Tenders</p>
                <p className={'bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950' + (tab === "Payments" ? ' bg-green-950' : '')} onClick={() => setTab("Payments")}>Payments collected</p>
            </div>
        </div>
        <div className='bg-[#164B30] h-200 w-5/6 rounded-sm'>
            <div>
              {tab === "Users" && <UserList />}
              {tab === "Tenders" && <TenderListAdmin />}
              {tab === "Approval" && <Approval />}
              {tab === "Summary" && (
                <>
                <div className='flex p-8 gap-4'>
                  <div className='bg-green-700 h-30 w-80 flex items-center rounded-md'>
                    <div className="w-3/4 h-full flex items-center justify-center text-2xl font-semibold">
                      Total Vendors
                    </div>
                    <div className="w-1/4 bg-green-600 h-full flex items-center justify-center text-2xl font-bold rounded-md">
                    100
                    </div>
                  </div>
                  <div className='bg-teal-800 h-30 w-80 flex items-center rounded-md'>
                    <div className="w-3/4 h-full flex items-center justify-center text-2xl font-semibold">
                      Total Tenders
                    </div>
                    <div className="w-1/4 bg-teal-900 h-full flex items-center justify-center text-2xl font-bold rounded-md">
                    200
                    </div>
                  </div>

                  <div className='bg-lime-900 h-30 w-80 flex items-center rounded-md'>
                    <div className="w-3/4 h-full flex items-center justify-center text-2xl font-semibold">
                      Total Buyers
                    </div>
                    <div className="w-1/4 bg-lime-800 h-full flex items-center justify-center text-2xl font-bold rounded-md">
                    112
                    </div>
                  </div>
                  
                  <div className='bg-emerald-700 h-30 w-80 flex items-center rounded-md'>
                    <div className="w-3/4 h-full flex items-center justify-center text-2xl font-semibold">
                      Pending Buyers
                    </div>
                    <div className="w-1/4 bg-emerald-600 h-full flex items-center justify-center text-2xl font-bold rounded-md">
                    11
                    </div>
                  </div>

                  <div className='bg-green-900 h-30 w-80 flex items-center rounded-md'>
                    <div className="w-3/4 h-full flex items-center justify-center text-2xl font-semibold">
                      Active Tenders
                    </div>
                    <div className="w-1/4 bg-green-800 h-full flex items-center justify-center text-2xl font-bold rounded-md">
                    118 
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
        </div>
    </div>
  )
}

export default Dashboard