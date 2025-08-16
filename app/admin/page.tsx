import React from 'react'
import Approval from '../components/Approval'

const Dashboard = () => {
  return (
    <div className='flex w-full p-4 gap-2 items-center justify-center'>
        <div className='bg-[#22734B] h-200 w-1/6 rounded-sm p-2 flex justify-center'>
            <div className='w-full flex-col gap-y-2 justify-center'>
                <p className='bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950'>Approve Buyers</p>
                <p className='bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950'>Manage Users</p>
                <p className='bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950'>Manage Tenders</p>
                <p className='bg-[#164B30] w-full py-2 cursor-pointer text-center rounded mb-1 hover:bg-green-950'>Payments collected</p>
            </div>
        </div>
        <div className='bg-[#164B30] h-200 w-4/5 rounded-sm'>
            <div>
              
            </div>
        </div>
    </div>
  )
}

export default Dashboard