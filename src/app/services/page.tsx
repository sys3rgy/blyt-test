/* eslint-disable @next/next/no-img-element */
'use client'

import FetchServicesCategoriesList from "@/components/NavBarComponents/FetchServicesCategoriesList";
import FetchInitialServicesList from "@/app/services/FetchInitialServicesList";
import ServicesBox from "@/components/ServicesComponents/ServicesBox";
import { poppinsFont, truenoRegular } from "@/fonts/Fonts";
import { LoadingGif, PlusIconInCircle1, StarIcon1 } from "@/images/ImagesExport";
import { MerchantData, ServiceCategoriesList } from "@/interfaces/MerchantDashboardInterface";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataContext } from "@/context/DataContext";

const ServicesPage: React.FC = () => {

    const { servicesCategoryList } = useContext(DataContext);

    const router = useRouter();

    const searchParams = useSearchParams()
    const categoryParams = searchParams.get('category')
    const ratingParams = searchParams.get('rating')

    const [servicesList, setservicesList] = useState<MerchantData[]>([]);
    const [servicesFetched, setservicesFetched] = useState(false)
    const [loading, setloading] = useState(true);

    async function fetchServicesList() {
        if (!servicesFetched) {
            setservicesFetched(true);
            const merchantServicesListresponse = await FetchInitialServicesList();
            setservicesList(merchantServicesListresponse.servicesList);
        }
    }

    async function fetchCustomServiceList(categoryName: string) {
        setservicesList([]);

        //! If clear filter is hit
        if (!categoryName) {
            setservicesFetched(false);
            router.push('/services')
            await fetchServicesList();
            return;
        }

        const merchantServicesListResponse = await axios.get(`/api/commonAPIs/merchantServicesFetch?category=${categoryName.replace(/ /g, '_').replace(/&/g, '-')}`);
        setservicesList(merchantServicesListResponse.data.servicesList);
    }

    useEffect(() => {
        setloading(true)
        if (!categoryParams && !ratingParams) {
            router.push(`/services`)
            fetchServicesList();
        } else {
            fetchCustomServiceList(categoryParams || '');
            router.push(`/services?category=${categoryParams?.replace(/ /g, '_').replace(/&/g, '-')}`)
        }
        setloading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryParams, ratingParams])

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const documentHeight = Math.max(body.scrollHeight, body.offsetHeight);

        const windowBottom = windowHeight + window.scrollY;

        if (windowBottom >= documentHeight) {
            console.warn("Reached bottom of page.");
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const [sliceServicesList, setsliceServicesList] = useState<number | undefined>(10);

    return (
        <>
            {loading &&
                <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {!loading &&
                <>
                    <section className="services-page-section flex max-w-screen-laptop m-auto">
                        <section className="lg:block hidden sticky top-0 left-side-filter-bar bg-white w-fit h-fit py-4 drop-shadow-lg rounded-b-lg mb-10 border border-[#9F885E]">
                            <section className="flex justify-between font-bold uppercase gap-20 px-10">
                                <p className={`${poppinsFont.className} font-bold`}>filters</p>
                                <p onClick={() => fetchCustomServiceList('')} className="text-[#9F885E] cursor-pointer whitespace-nowrap">clear filter</p>
                            </section>

                            <section className={`${poppinsFont.className} font-bold heading uppercase text-[#4D4D4D] mt-4 px-10`}>
                                all categories
                            </section>

                            <section className={`${truenoRegular.className} services-categories-name mt-4 px-10`}>
                                {servicesCategoryList?.slice(0, sliceServicesList).map((items: ServiceCategoriesList) => {
                                    return (
                                        <Link href={`/services?category=${items.category.replace(/ /g, '_').replace(/&/g, '-')}`} className="flex items-center gap-3 font-medium mt-2 cursor-pointer" key={items._id}>
                                            <img width={20} height={20} src={items?.link} alt="" /> {items.category}
                                        </Link>
                                    )
                                })}

                                {sliceServicesList === 10 &&
                                    <button onClick={() => setsliceServicesList(undefined)} className={`${poppinsFont.className} font-normal flex uppercase items-center gap-2 text-sm mt-4`}>
                                        see more <PlusIconInCircle1 width={25} height={25} customCSS={""} />
                                    </button>
                                }

                                {!sliceServicesList &&
                                    <button onClick={() => setsliceServicesList(10)} className={`${poppinsFont.className} font-normal flex uppercase items-center gap-2 text-sm mt-4`}>
                                        see less <PlusIconInCircle1 width={25} height={25} customCSS={""} />
                                    </button>
                                }

                            </section>

                            <div className="hidden border border-[#4D4D4D] w-full mt-4"></div>

                            {/* Average Rating Sort Section */}
                            <section className="hidden average-rating-section">
                                <section className="heading mt-4 px-10">

                                    <p className={`${poppinsFont.className} font-bold uppercase text-[#4D4D4D]`}>average rating</p>

                                    <section className={`${truenoRegular.className} ratings-range flex flex-col gap-1 mt-4`}>
                                        <section className="flex items-center gap-1 cursor-pointer">
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <span className="ml-1">& up</span>
                                        </section>

                                        <section className="flex items-center gap-1 cursor-pointer">
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <span className="ml-1">& up</span>
                                        </section>

                                        <section className="flex items-center gap-1 cursor-pointer">
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <StarIcon1 width={17} height={17} customCSS={""} />
                                            <span className="ml-1">& up</span>
                                        </section>
                                    </section>

                                </section>
                            </section>
                        </section>

                        <section className="right-side pl-5 mt-5 w-full pr-5">
                            <section className="max-width max-w-screen-xl m-auto">
                                <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">

                                    {servicesList?.map((items) => {
                                        return (
                                            <div key={items._id} className="sm:m-0 m-auto">
                                                <ServicesBox
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    backgroundImage={items.service.serviceBanner ? items.service.serviceBanner : "/images/MerchantDashboardImages/default-banner-1.jpg"}
                                                    companyLogo={items.service.serviceImages[0]}
                                                    companyName={items.service.serviceName}
                                                    companycategory={items.service.serviceCategory}
                                                    // companyPageLink={items.websiteLink} />
                                                    companyPageLink={`/merchant/${items.userName}/${encodeURIComponent(items.businessName).replace(/%20/g, '-')}`}
                                                    averageRatings={items.averageRatings}
                                                    dealsCount={items.totalReviewsCount}
                                                />
                                            </div>
                                        )
                                    })}

                                </div>
                            </section>
                        </section>
                    </section>

                </>
            }
        </>
    )
}

export default ServicesPage