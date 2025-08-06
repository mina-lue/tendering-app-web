import React from 'react'
import { FaBuilding } from 'react-icons/fa'
import { FaRegFileLines } from 'react-icons/fa6'
import { MdDelete, MdEmail } from 'react-icons/md'
import { TiPhone, TiTick } from 'react-icons/ti'

const Approval = () => {
  return (
    <div className='flex w-full gap-5'>
        <div className='w-1/5 bg-[#22734B] rounded-md h-160'>
            <div className='text-center rounded-t-md bg-[#003C24] py-2 text-xl'>
                Select Buyer
            </div>
            <div className='m-2'>
                <div className='bg-gradient-to-t from-green-800 to-green-900 py-1 text-center hover:from-green-900 hover:to-green-950 cursor-pointer mb-1'>
                    <p>Company One</p>
                </div>
                <div className='bg-gradient-to-t from-green-800 to-green-900 py-1 text-center hover:from-green-900 hover:to-green-950 cursor-pointer mb-1'>
                    <p>Company Two</p>
                </div>
                <div className='bg-gradient-to-t from-green-800 to-green-900 py-1 text-center hover:from-green-900 hover:to-green-950 cursor-pointer mb-1'>
                    <p>Company Three</p>
                </div>
            </div>
        </div>
        <div className='w-3/5 flex justify-center items-center'>
            <div className='m-2 flex-col justify-center'>
                <div className='flex items-center gap-2 text-3xl'>
                    <FaBuilding className="text-green-500 text-3xl"/>
                    <h2>Buyer Name</h2>
                </div>
                <div className='mt-4'>
                    <div className='flex items-center gap-2'>
                        <TiPhone className='text-green-500 text-xl' />
                        <p>0924972280</p>
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='flex items-center gap-2'>
                        <MdEmail className='text-green-500 text-xl' />
                        <p>minalu@gmail.com</p>
                    </div>
                </div>
                <div className='mt-4'>
                    <div className='flex items-center gap-2'>
                        <FaRegFileLines className='text-green-500 text-xl' />
                        <p>Business License</p>
                    </div>
                </div>

                <div className='mt-4 flex gap-4'>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <TiTick className='text-blue-500 text-xl' />
                        <p className='text-blue-500'>Approve</p>
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <MdDelete className='text-red-500 text-xl' />
                        <p className='text-red-500'>Delete</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Approval