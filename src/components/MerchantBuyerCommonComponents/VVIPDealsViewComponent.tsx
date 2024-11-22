/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useContext, useState } from 'react';
import { DeleteIcon1, VVIPDealsBackupImage1 } from "@/images/ImagesExport";
import { playfairDisplayFont } from '@/fonts/Fonts';
import ButtonComponent1 from '../CommonComponents/ButtonComponent1';
import { DealsListData } from '@/interfaces/MerchantDashboardInterface';
import { DataContext } from '@/context/DataContext';

interface VVIPDealsViewComponentProps {
    dealsList: any[];
    deleteDeal?: (itemID: string, dealName: string) => void;
}

const VVIPDealsViewComponent: React.FC<VVIPDealsViewComponentProps> = ({ dealsList, deleteDeal }) => {

    const { isSessionExist } = useContext(DataContext);

    const [flippedCards, setFlippedCards] = useState<boolean[]>(new Array(dealsList.length).fill(false));

    const handleFlipClick = (index: number) => {
        const newFlippedCards = [...flippedCards];
        newFlippedCards[index] = !newFlippedCards[index];
        setFlippedCards(newFlippedCards);
    };

    return (
        <>
            {dealsList.map((items: DealsListData, index: number) => (
                <section key={items._id} className={`VVIPDealsViewComponent flex lg:flex-row flex-col justify-between gap-10 relative`}>

                    <section className={`right-side h-[300px] drop-shadow-lg flip-container ${flippedCards[index] ? 'flip' : ''} `}>
                        <div className="flipper absolute w-[368px] h-auto m-auto">
                            <section className={`bg-white  rounded-lg h-[300px] w-full transition-all duration-500 ease-in-out preview-section front teeny:px-0 px-5`} onClick={() => handleFlipClick(index)}>
                                <div className={`image-section-for-vvip-deals-info relative`}>
                                    {!items?.dealPicture ? (
                                        <VVIPDealsBackupImage1 width={400} height={124} customCSS={'max-w-[368px]'} />
                                    ) : (
                                        <img
                                            className="w-full h-[124px] rounded-lg"
                                            src={items?.dealPicture || ''}
                                        />
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <ButtonComponent1 middleSide={'get code'} customSectionCSS={"cursor-pointer"} />
                                    </div>
                                </div>

                                <div className="text-section-for-vvip-deals-info bg-white p-6">
                                    <p className={`${playfairDisplayFont.className} font-semibold text-[#B35E5E] text-base capitalize`}>{items.discountValue || 'up to XX% off'}</p>
                                    <p className='my-2 break-words'>{items.couponDescription || "Coupon Description"}</p>
                                    <p> <span className='capitalize font-bold break-words'>company name:</span> {items.merchantUserName}</p>
                                </div>

                                {deleteDeal &&
                                    <div onClick={() => deleteDeal(items._id, items.discountValue)} className='absolute right-4 bottom-4 z-50'><DeleteIcon1 width={100} height={100} customCSS={'cursor-pointer w-8 h-8'} /></div>
                                }

                            </section>

                            <section className={`preview-section back bg-white rounded-lg drop-shadow-lg`} onClick={(e) => e.stopPropagation()}>
                                <div className={`image-section-for-vvip-deals-info relative w-[368px] p-4 h-[300px]`}>
                                    <p className='font-bold text-2xl'>Steps to redeem:</p>
                                    <p className='mt-2 break-words'>
                                        {items.stepsToRedeem || "kindly add steps to redeem the code."}
                                    </p>
                                    <p className='font-bold capitalize mt-3'>
                                        coupon code:
                                        <span>
                                            {isSessionExist ? ` ${items.couponCode}` : ` Please Login To Continue`}
                                        </span>
                                    </p>
                                </div>
                                <div onClick={() => handleFlipClick(index)} className="absolute top-2 right-2">
                                    <ButtonComponent1 middleSide={'hide'} customSectionCSS={"cursor-pointer"} />
                                </div>
                            </section>
                        </div>
                    </section>
                </section>
            ))}
        </>
    );
};

export default VVIPDealsViewComponent;
