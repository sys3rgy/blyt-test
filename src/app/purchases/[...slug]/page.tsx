'use client'

import { LoadingGif } from "@/images/ImagesExport";
import Link from "next/link";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

interface Params {
    slug: string;
}

interface PurchaseCompletedPageProps {
    params: Params;
}

const PurchaseCompletedPage: React.FC<PurchaseCompletedPageProps> = ({ params }) => {

    const paymentStatus = params.slug[0];

    return (
        <>
            <div className="bg-gray-100 h-screen">
                <div className="bg-white p-6  md:mx-auto">

                    {paymentStatus === "1" ?
                        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                            <path fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                            </path>
                        </svg>
                        :
                        <svg viewBox="0 0 24 24" className="text-red-600 w-16 h-16 mx-auto my-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    }

                    <div className="text-center">
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">{paymentStatus === "1" ? "Points added successfully" : "Payment failed"}!</h3>

                        <p className="text-gray-600 my-2">
                            {paymentStatus === "1" ?
                                "Thank you for completing your secure online payment."
                                :
                                "Sorry your payment was failed. Please try again later."
                            }
                        </p>

                        <p> Have a great day!  </p>
                        <div className="py-10 text-center">
                            <Link href="/" className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                                GO BACK
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PurchaseCompletedPage