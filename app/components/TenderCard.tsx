import Link from "next/link";
import React from "react";
import { FaBuilding } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";

const TenderCard = () => {
    return (
        <div className='bg-green-900 w-full rounded-sm shadow-sm p-2 mb-4 hover:bg-green-800'>
            <div className='flex justify-between items-center'>
                <div className="flex items-center gap-1 ml-2">
                    <FaBuilding className="text-green-500"/>
                    <h2 className='font-semibold text-xl text-green-600'>Company Name</h2>
                </div>
                <div className="flex items-center gap-1 text-sm mr-2 text-green-200">
                    <MdCalendarMonth />
                    <p > from DD-MM-YY, HH:MM to DD-MM-YY, HH:MM</p>
                </div>
            </div>
            <p className="text-sm p-2">
                Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the ...
            </p>
            <div className='flex justify-between items-center'>
                <p></p>
                
                    <Link href={`listing/1`} className="text-blue-600 text-sm">See details</Link>
                </div>
        </div>
    );
};

export default TenderCard;