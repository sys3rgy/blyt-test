'use client'

import { DefaultProfilePic1, PencilIcon3, StarIcon1, StarIcon2 } from '@/images/ImagesExport'
import React, { useEffect, useState } from 'react'
import ButtonComponent1 from '../CommonComponents/ButtonComponent1';
import BuyerReviewBoxComponent from '../ReviewComponents/BuyerReviewBoxComponent';
import { poppinsFont, roxboroughcfFont } from '@/fonts/Fonts';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DealItem {
    _id: React.Key | null | undefined;
    barColor: string;
    userProfilePic: string | null | undefined;
    merchantId: {
        userProfilePic: string | null | undefined;
        businessName: string;
        userName: string;
    };
    orderStatus: string;
    packageAmount: number;
    orderReviewed: boolean;
    rating: number | undefined;
    packageName: string;
    packageDescription: string;
}

interface LatestItemsList {
    itemsList: any;
    barColor: string;
}

const roxboroughcfFontCSS = `${roxboroughcfFont.className} font-bold`;

const LatestOrderViewBoxComponent: React.FC<LatestItemsList> = ({ itemsList, barColor }) => {

    const [reviewUser, setreviewUser] = useState(false);

    const [dealsList, setdealsList] = useState<DealItem[] | null>(null);
    const [showList, setshowList] = useState(true);
    const [showLoadingText, setshowLoadingText] = useState(true);

    const [itemToReview, setitemToReview] = useState<DealItem | null>(null);

    useEffect(() => {
        if (itemsList === null) {
            setshowList(true);
            setshowLoadingText(true);
            return;
        }

        if (itemsList && itemsList._id && !itemsList.length) {
            setdealsList([itemsList]);
            setshowLoadingText(false);
            return;
        }

        if (itemsList && itemsList.length === 0) {
            setshowList(false);
            setshowLoadingText(false);
            return;
        }

        if (itemsList && itemsList.length >= 1) {
            setdealsList(itemsList);
            setshowLoadingText(false);
        }
    }, [itemsList])

    //! Cancel an order
    async function cancelOrder(itemId: string) {

        const config = {
            data: { itemId }
        };

        const response = await axios.delete(`/api/ordersAPIs/addUpdateOrderStatus`, config);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            window.location.href = '/';
        } else if (statusCode === 200) {
            toast.success(message, {});
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    //! Fetch merchant contact number, & redirect to whatsapp
    async function contactMerchant(itemId: string) {
        const fetchMerchantPhoneNumber = await axios.get(`/api/ordersAPIs/addUpdateOrderStatus?orderId=${itemId}`)
        window.open(`https://wa.me/${fetchMerchantPhoneNumber.data.merchantContactNumber}`, '_blank');
    }

    return (
        <>
            {showList && !showLoadingText && dealsList && dealsList?.map((items: DealItem) => (
                <section key={items?._id} className={`my-package-box flex my-4`}>
                    <section style={{ backgroundColor: `#${barColor}` }} className={`left-side-color md:w-8 w-4 h-auto rounded-l-lg`}></section>
                    <section className="buyer-contacts-list-box right-side-details-box bg-white w-full lg:mr-5 mr-0 rounded-r-lg sm:px-8 px-2 sm:py-4 py-2 flex justify-between">
                        <section className='left-side-section w-full'>
                            <section className='package-image-name-merchant-userName-price-range-section flex justify-between gap-1'>
                                <div className='merchant-image-package-name-userName flex items-center sm:gap-4 gap-1'>
                                    <span className='package-image left-side'>
                                        {(!items?.merchantId?.userProfilePic && !items?.userProfilePic) ?
                                            <DefaultProfilePic1 width={80} height={80} customCSS={'sm:w-20 w-10 rounded-full'} />
                                            :
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img className='sm:w-20 w-10 rounded-full' width={80} height={80} src={items?.merchantId?.userProfilePic || items?.userProfilePic || undefined} alt="" />
                                        }
                                    </span>
                                    <span className="right-side">
                                        <p className={`${roxboroughcfFontCSS} sm:text-lg text-sm`}>{items?.merchantId?.businessName}</p>
                                        <p className={`${poppinsFont.className} font-medium sm:text-sm text-xs my-[2px]`}>{items?.merchantId?.userName}</p>
                                        <p className='sm:text-sm text-xs'><span className="font-bold">Status:</span> <span className="capitalize">{items?.orderStatus}</span></p>
                                    </span>
                                </div>
                                <section className='package-price-range right-side-section capitalize flex flex-col whitespace-nowrap text-center'>
                                    <span className={`${poppinsFont.className} font-medium sm:text-base text-xs`}>price</span>
                                    <span className={`${poppinsFont.className} font-bold sm:text-base text-xs`}>{items?.packageAmount}</span>
                                </section>

                                {items?.orderStatus !== 'done deals' &&
                                    <div className="buttons flex flex-col gap-1 text-center">
                                        {items?.orderStatus === 'initiated contact' &&
                                            <span onClick={() => cancelOrder(items?._id as string)} className='h-fit cursor-pointer bg-red-500 px-4 py-2 rounded-lg drop-shadow-lg font-bold sm:text-base text-xs text-white uppercase'>cancel</span>
                                        }
                                        <span onClick={() => contactMerchant(items?._id as string)} className='h-fit cursor-pointer bg-green-500 px-4 py-2 rounded-lg drop-shadow-lg font-bold sm:text-base text-xs text-white uppercase'>contact</span>
                                    </div>
                                }

                                {items?.orderStatus === 'done deals' &&
                                    <>
                                        {(items?.orderStatus === 'done deals' && items?.orderReviewed === false) ?
                                            <div onClick={() => { setreviewUser(true); setitemToReview(items); }} className='cursor-pointer'>
                                                <ButtonComponent1 middleSide={'leave a review'} rightSide={<PencilIcon3 width={20} height={20} customCSS={'max-w-[18px] w-auto h-auto'} />} customButtonCSS='' />
                                            </div>
                                            :
                                            <div className={`
                        ${items?.rating === 1 ? "bg-red-500" :
                                                    items?.rating === 2 ? "bg-yellow-500" :
                                                        items?.rating === 3 ? "bg-green-400" :
                                                            items?.rating === 4 ? "bg-green-600" :
                                                                items?.rating === 5 ? "bg-[#9F885E]" :
                                                                    ""} text-white h-fit px-2 font-bold flex items-baseline rounded-lg drop-shadow-lg`}>
                                                <p className='flex items-center gap-1'>{items?.rating} <StarIcon2 width={15} height={15} customCSS={''} /></p>
                                            </div>
                                        }
                                    </>
                                }

                            </section>

                            <div className='package-name-and-description flex flex-col mt-4'>
                                <span className={`${poppinsFont.className} font-medium about-package sm:text-lg text-sm capitalize`}>{items?.packageName}</span>
                                <div className={`${poppinsFont.className} font-normal package-description sm:text-sm text-xs`}>
                                    <div className='lg:block hidden'>
                                        {(items?.packageDescription).length > 200 ? `${(items?.packageDescription).slice(0, 200)}....` : (items?.packageDescription)}
                                    </div>
                                    <div className='lg:hidden block'>
                                        {(items?.packageDescription).length > 200 ? `${(items?.packageDescription).slice(0, 100)}....` : (items?.packageDescription)}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                </section>
            ))}

            {(!showLoadingText && !showList) &&
                <div>
                    No orders found.
                </div>
            }

            {(showLoadingText && showList) &&
                <div>loading....</div>
            }

            {reviewUser &&
                <section className="backdrop-blur-sm buyer-review-box-section fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex min-w-[700px] z-50">
                    <BuyerReviewBoxComponent cancelReview={() => setreviewUser(false)} itemsList={itemToReview} />
                </section>
            }
        </>

    )
}

export default LatestOrderViewBoxComponent