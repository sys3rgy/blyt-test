/* eslint-disable @next/next/no-img-element */
'use client'

import LatestOrderViewBoxComponent from "@/components/BuyerDashboardComponents/LatestOrderViewBoxComponent";
import { poppinsFont, roxboroughcfFont } from "@/fonts/Fonts";
import { LoadingGif } from "@/images/ImagesExport";
import { InitiatedContactsList } from "@/interfaces/MerchantDashboardInterface";
import axios from "axios";
import { useEffect, useState } from "react";


interface Params {
    slug: string;
    userName: string;
}

const roxboroughcfFontCSS = `${roxboroughcfFont.className} font-bold`;
const TabActiveCSS = `underline underline-offset-8 decoration-[3px] decoration-[#9F885E] ${roxboroughcfFontCSS}`;
const TabInactiveCSS = `text-[#4D4D4D] cursor-pointer ${roxboroughcfFontCSS}`;

const BuyerDashboard: React.FC<{ params: Params }> = ({ params }) => {

    const { userName } = params;

    const [loading, setloading] = useState(true);

    //! Setting tab css & showing the tab data on click
    const [activeTab, setActiveTab] = useState('initiated_contact');
    const showTab = (tabName: string) => {
        setActiveTab(tabName);

        if (tabName === activeTab) return;

        fetchBuyerOrdersList(tabName);
    }

    const [totalPages, settotalPages] = useState(0);
    const [dealsPage, setdealsPage] = useState(0);


    const handlePageChange = (newPage: any) => {
        setdealsPage(newPage);
    };

    const [dealsList, setdealsList] = useState<InitiatedContactsList[] | null>(null);

    //! Fetching buyer orders list
    async function fetchBuyerOrdersList(tabName: string | null) {

        if (tabName?.replace(/_/g, ' ') === activeTab) {
            return;
        }

        if (!tabName) {
            tabName = activeTab;
        }

        setdealsList(null);

        const response = await axios.get(`/api/buyersAPIs/buyerFetchOrdersListAPI?userName=${userName}&list=${tabName}&dealsPages=${dealsPage}`)

        const statusCode = response.data.statusCode;
        if (statusCode === 404) {
            window.location.href = '/';
            return;
        }

        setdealsList(response.data.dealsList);

        settotalPages(Math.ceil(response.data.totalDocs / 5));
    }

    useEffect(() => {
        setActiveTab('initiated_contact');
        fetchBuyerOrdersList('initiated_contact');
        setloading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [setBackground, setsetBackground] = useState('9F885E');
    useEffect(() => {
        if (activeTab === 'initiated_contact') {
            setsetBackground('9F885E')
        } else if (activeTab === 'work_in_progress') {
            setsetBackground('509652')
        } else if (activeTab === 'done_deals') {
            setsetBackground('6D6E72')
        }
    }, [activeTab])


    useEffect(() => {
        fetchBuyerOrdersList(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealsPage])

    return (
        <>
            {loading &&
                <section className="loading-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {!loading &&

                <section className="buyer-dashboard-section max-w-screen-xl px-4 mx-auto my-8">
                    <section className="flex lg:flex-row flex-col gap-10">
                        <section className="nav-bar-section-buyer-order-dashboard capitalize flex gap-5 font-bold mb-8 justify-between w-full text-center">
                            <p onClick={() => showTab('initiated_contact')} className={`${activeTab === 'initiated_contact' ? TabActiveCSS : TabInactiveCSS}`}>initiated contacts</p>
                            <p onClick={() => showTab('work_in_progress')} className={`${activeTab === 'work_in_progress' ? TabActiveCSS : TabInactiveCSS}`}>work in progress</p>
                            <p onClick={() => showTab('done_deals')} className={`${activeTab === 'done_deals' ? TabActiveCSS : TabInactiveCSS}`}>done deals</p>
                        </section>

                    </section>

                    <LatestOrderViewBoxComponent
                        itemsList={dealsList}
                        barColor={setBackground}
                    />

                    {/* Pagination Buttons */}
                    {dealsList?.length !== 0 &&
                        <div className="flex justify-center mt-4 items-center gap-4">
                            <button
                                onClick={() => handlePageChange(dealsPage - 1)}
                                disabled={dealsPage === 0}
                                className={`mr-2 ${dealsPage === 0 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-400 px-2 py-2 rounded-full'} `}
                            >
                                <img className='rotate-180 w-3' src="/images/TableImages/swiper-button.png" alt="" />
                            </button>

                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index)}
                                    className={`${poppinsFont.className} mr-2 ${dealsPage === index ? `text-black font-semibold` : 'text-gray-400'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(dealsPage + 1)}
                                disabled={dealsPage === totalPages - 1}
                                className={`ml-2 ${dealsPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'bg-gray-400 px-2 py-2 rounded-full'}`}
                            >
                                <img className='w-3' src="/images/TableImages/swiper-button.png" alt="" />
                            </button>
                        </div>
                    }

                </section>
            }
        </>
    )
}

export default BuyerDashboard