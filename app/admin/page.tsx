import React from 'react'
import Approval from '../components/Approval'

const Dashboard = () => {
  return (
    <div className='flex w-full mt-10 p-4 gap-2 items-center justify-center'>
        <div className='bg-[#22734B] h-200 w-1/5 rounded-sm p-4 flex justify-center'>
            <div className='w-full flex-col gap-y-2 justify-center'>
                <p className='bg-[#164B30] w-3/4 p-2 cursor-pointer text-center rounded mb-2 hover:bg-green-950'>Approve Buyers</p>
                <p className='bg-[#164B30] w-3/4 p-2 cursor-pointer text-center rounded mb-2 hover:bg-green-950'>Manage Users</p>
                <p className='bg-[#164B30] w-3/4 p-2 cursor-pointer text-center rounded mb-2 hover:bg-green-950'>Manage Tenders</p>
                <p className='bg-[#164B30] w-3/4 p-2 cursor-pointer text-center rounded mb-2 hover:bg-green-950'>Payments collected</p>
            </div>
        </div>
        <div className='bg-[#164B30] h-200 w-3/4 rounded-sm p-4'>
            <p className='text-center'>Approve Buyer</p>
            <div className='m-4'>
              <Approval />
            </div>
        </div>
    </div>
  )
}

export default Dashboard