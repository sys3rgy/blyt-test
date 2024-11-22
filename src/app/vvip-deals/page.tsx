/* eslint-disable @next/next/no-img-element */
'use client'

import SwiperForAdSection1 from "@/components/AdSection1Components/SwiperForAdSection1";
import VVIPDealsViewComponent from "@/components/MerchantBuyerCommonComponents/VVIPDealsViewComponent";
import { LoadingGif } from "@/images/ImagesExport";
import { useState, useEffect, useContext } from "react";
import { FetchVVIPDeals } from "./FetchVVIPDeals";
import HeadingComponent1 from "@/components/CommonComponents/HeadingComponent1";
import { DataContext } from "@/context/DataContext";

const ServicesPage: React.FC = () => {

    const { isSessionExist } = useContext(DataContext);

    const [loading, setloading] = useState(true);
    const [dealsList, setdealsList] = useState([]);

    async function fetchingVVIPDeals() {
        const data = await FetchVVIPDeals(false, isSessionExist);
        setdealsList(data.dealsList);
    }

    useEffect(() => {
        fetchingVVIPDeals();
        setloading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {loading &&
                <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {!loading &&
                <section className="vvip-deals-section">
                    <section className="max-width max-w-screen-xl m-auto pb-16">
                        {/* Ad Section 1 */}
                        <SwiperForAdSection1 />

                        <section className="mt-8 px-4">
                            <HeadingComponent1 title={"all deals"} lineWidth={""} showRightSide={false} />
                        </section>

                        <section className="deals-section px-6 flex xl:justify-between justify-center flex-wrap xl:gap-y-16 gap-y-8 gap-x-8">
                            <VVIPDealsViewComponent dealsList={dealsList} />
                        </section>
                    </section>
                </section>
            }
        </>
    )
}

export default ServicesPage