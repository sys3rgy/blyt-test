'use client'

import { interFont, poppinsFont } from "@/fonts/Fonts";
import Image from "next/image";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
const LeaderboardTableLayout: React.FC = () => {

    const data = [
        { companyName: 'Company A', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 100 },
        { companyName: 'Company B', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 85 },
        { companyName: 'Company C', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 25 },
        { companyName: 'Company D', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 15 },
        { companyName: 'Company E', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company F', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company G', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company H', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company I', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company J', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company K', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company L', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company M', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company N', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company O', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company P', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company Q', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company R', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company S', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
        { companyName: 'Company T', companyLogo: "/images/TableImages/company-test-icon.png", BLYTpoints: 5 },
    ];

    const itemsPerPage = 5; // Number of items to display per page
    const [currentPage, setCurrentPage] = useState(0);

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage: any) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <div className="mt-8 flex md:text-base text-xs drop-shadow-md">
                <div className='max-w-[1208px] m-auto flex w-full items-center capitalize text-[#4D6472]'>
                    <div className="relative sm:rounded-md w-full">
                        <table className="w-full text-sm text-left text-black dark:text-black">
                            <thead className="text-xs text-white uppercase dark:text-[#4D4D4D] text-left whitespace-nowrap drop-shadow-[0_-4px_5px_rgba(0,0,0,0.25)] border-b-[1px] border-solid flex w-full flex-col justify-between">
                                <tr className={`bg-white py-1 mx-2`} style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>
                                    <th className={`${poppinsFont.className} font-normal sm:px-6 px-2 pt-3 pb-4 rounded-tl-2xl sm:min-w-[80px] min-w-fit`}>
                                        rank
                                    </th>
                                    <th className={`${poppinsFont.className} font-normal px-6 py-3 sm:min-w-[62px] min-w-fit`}>
                                    </th>
                                    <th className={`${poppinsFont.className} font-normal sm:px-3 px-5 py-3 sm:min-w-[250px] min-w-fit text-center`}>
                                        company
                                    </th>
                                    <th className={`${poppinsFont.className} font-normal  px-6 py-3 rounded-tr-2xl`}>
                                        BLYTpoints
                                    </th>
                                </tr>
                            </thead>
                            {/* Displaying The Pagination Data */}
                            <tbody className="flex flex-col gap-2 w-full -mt-2">
                                {paginatedData.map((item, index) => {
                                    const absoluteIndex = startIndex + index + 1;
                                    let bgColorClass = '';

                                    if (absoluteIndex === 1) {
                                        bgColorClass = `${poppinsFont.className} font-bold bg-[#FFE9CF]`; // Index 1 Color
                                    } else if (absoluteIndex === 2) {
                                        bgColorClass = `${interFont.className} font-semibold bg-[#FFF4E7]`; // Index 2 Color
                                    } else if (absoluteIndex === 3) {
                                        bgColorClass = `${interFont.className} font-semibold bg-[#FFF4E7]`; // Index 3 Color
                                    } else if (absoluteIndex % 2 === 0) {
                                        bgColorClass = `${poppinsFont.className} font-medium bg-[#EDF3F3]`; // Even Index Color
                                    } else {
                                        bgColorClass = `${poppinsFont.className} font-medium bg-[#FFFFFF]`; // Odd Index Color
                                    }

                                    return (
                                        <tr
                                            key={index}
                                            className={`${bgColorClass} rounded-md flex flex-row items-center w-full z-50
                                                                ${absoluteIndex <= 3 ? 'outline-1 outline-black outline' : ""}
                                                                `}
                                        >
                                            <td
                                                className={` rounded-tl-lg rounded-r-lg min-w-[80px] flex items-center 
                                                                    ${absoluteIndex === 1 ? 'pl-4 -ml-4 mr-7 text-base font-bold bg-[#A08464]'
                                                        : absoluteIndex === 2 ? 'pl-4 -ml-4 mr-7 text-base font-bold bg-[#9A9A9A]'
                                                            : absoluteIndex === 3 ? 'pl-3 pr-3 -ml-4 mr-7 justify-around text-base font-bold bg-[#FFD976] outline-1 outline-[#9F885E] outline'
                                                                : 'pl-[30px]  mr-9 -ml-4 text-sm font-bold justify-around'
                                                    } z-50`}
                                            >
                                                {absoluteIndex === 1 ? (
                                                    <img className='ml-[-10px] mr-5 w-7 py-1' src="/images/TableImages/leaderboard-3.png" alt="" />
                                                ) : absoluteIndex === 2 ? (
                                                    <img className='ml-[-10px] mr-5 w-6 py-1' src="/images/TableImages/leaderboard-2.png" alt="" />
                                                ) : absoluteIndex === 3 ? (
                                                    <img className='ml-[-10px] mr-2 w-5 py-1' src="/images/TableImages/leaderboard-1.png" alt="" />
                                                ) : (
                                                    ''
                                                )} {absoluteIndex}
                                            </td>
                                            {(absoluteIndex > 3) ?
                                                <td className={`sm:pl-4 pl-0`}><Image width={37} height={37} src={item.companyLogo} alt="" /></td>
                                                :
                                                <td className={`sm:pl-6 pl-0`}><Image width={37} height={37} src={item.companyLogo} alt="" /></td>
                                            }
                                            <td className={`${poppinsFont.className} font-bold sm:pl-6 pl-1 py-4 sm:min-w-[250px] min-w-fit text-center`}>{item.companyName}</td>
                                            <td className={`${poppinsFont.className} font-bold pl-6 rounded-r-xl ml-2`}>{item.BLYTpoints}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination Buttons */}
            <div className="flex justify-center mt-4 items-center gap-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`mr-2 ${currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-400 px-2 py-2 rounded-full'} `}
                >
                    <img className='rotate-180 w-3' src="/images/TableImages/swiper-button.png" alt="" />
                </button>

                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index)}
                        className={`${poppinsFont.className} mr-2 ${currentPage === index ? `text-black font-semibold` : 'text-gray-400'
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className={`ml-2 ${currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-400 px-2 py-2 rounded-full'}`}
                >
                    <img className='w-3' src="/images/TableImages/swiper-button.png" alt="" />
                </button>
            </div>
        </>
    )
}

export default LeaderboardTableLayout;