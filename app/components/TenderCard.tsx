import React from "react";

const TenderCard = () => {
    return (
        <div className='bg-green-800 w-full rounded-sm shadow-sm p-2 mb-4 hover:bg-green-900'>
            <div className='flex justify-between items-center'>
                <h2 className='font-semibold text-xl text-zinc-300'>Company Name</h2>
                <p>open from: DD-MM-YY, HH:MM</p>
            </div>
            <p>
                Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the place for the deatils of the tender.Here is the ...
            </p>
            <div className='flex justify-between items-center'>
                <p></p>
                <p>See details</p>
            </div>
        </div>
    );
};

export default TenderCard;