/* eslint-disable @next/next/no-img-element */
'use client'

import ButtonComponent1 from '@/components/CommonComponents/ButtonComponent1';
import HeadingComponent1 from '@/components/CommonComponents/HeadingComponent1';
import SocialMediaShareButton from '@/components/CommonComponents/SocialMediaShareButton';
import ImageMagnifier from '@/components/ImageMagnifier';
import BuyerReviewBox from '@/components/MerchantBuyerCommonComponents/BuyerReviewBox';
import FundingViewComponent from '@/components/MerchantBuyerCommonComponents/FundingViewComponent';
import MerchantLeftSideBoxComponent from '@/components/MerchantComponents/MerchantLeftSideBoxComponent';
import { poppinsFont, roxboroughcfFont } from '@/fonts/Fonts';
import LikesIcon2 from '@/images/CommonImages/LikesIcon2';
import { CrossIcon1, CrownIcon3, DefaultProfilePic1, LikesIcon1, LoadingGif, NoImageIcon1, PDFIcon1, ShareIcon1, VerifiedIcon1 } from '@/images/ImagesExport';
import { MerchantData, PackageListData, ReviewsList } from '@/interfaces/MerchantDashboardInterface';
import ToastContainerUtil from '@/utils/ToastContainerUtil';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Key, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import FetchPublicMerchantData from './FetchPublicMerchantData';
import InputComonentForSignInUpPage from '@/components/CommonComponents/InputComonentForSignInUpPage';

interface Params {
    slug: string;
    userName: string;
    merchantCompanyName: string;
}

interface MerchantPublicPageProps {
    params: Params;
}

const MerchantPublicPage: React.FC<MerchantPublicPageProps> = ({ params }) => {

    const searchParams = useSearchParams();
    const referredByUserName = searchParams.get('referral')

    const userNameCookie = getCookie('userName')

    const router = useRouter();
    const pathname = usePathname();

    const { userName } = params;

    const [buyerUserId, setbuyerUserId] = useState('');

    const [merchantData, setmerchantData] = useState<MerchantData | null>(null);
    const [buyerLikeIt, setbuyerLikeIt] = useState(false);

    const [loading, setloading] = useState(true);
    const [serviceImages, setserviceImages] = useState([]);
    const [userProfilePic, setuserProfilePic] = useState<File | string | null>(null);
    const [serviceBanner, setserviceBanner] = useState('');

    //! Data to send to backend
    const [merchantServiceName, setmerchantServiceName] = useState('');
    const [merchantUserName, setmerchantUserName] = useState('')
    const [packgeToInitiate, setpackgeToInitiate] = useState('');

    const [sourceText, setSourceText] = useState<string>('');
    const copyText = () => {
        if (sourceText) {
            navigator.clipboard.writeText(sourceText).then(() => {
                alert('Text copied to clipboard: ' + sourceText);
            }).catch((err) => {
                console.error('Error copying to clipboard:', err);
            });
        }
    };

    async function fetchMerchantPublicData() {

        setloading(true);

        let merchantCompanyName = pathname.slice(10).split('/')[1].replace(/&/g, "%26");

        const merchantUsername = pathname.slice(10).split('/')[0];

        const response = await FetchPublicMerchantData(merchantUsername, merchantCompanyName, userNameCookie);
        const statusCode = response.statusCode;

        if (statusCode === 200) {

            const data = response.merchantData;
            setmerchantData(data)

            setbuyerLikeIt(response.buyerLikedIt)

            setserviceImages(data.service.serviceImages || [])
            setSourceText(data.websiteLink || "");

            setserviceBanner(data.service.serviceBanner || "/images/MerchantDashboardImages/default-banner-1.jpg");

            setuserProfilePic(data.userProfilePic);

            //! Data to send to backend
            setmerchantServiceName(data.service.serviceName)
            setmerchantUserName(data.userName)
        } else {
            // router.push('/');
        }

        setloading(false);

    }

    //! Setting tab css & showing the tab data on click
    const [activeTab, setActiveTab] = useState('service');
    const showTab = (tabName: string) => {
        setActiveTab(tabName);
    }

    useEffect(() => {
        fetchMerchantPublicData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //! Initiate Contact

    async function checkIfMerchantTryingToInitiateContact() {

        const response = await axios.get(`/api/commonAPIs/serverSessionCheck`);

        const statusCode = response.data.statusCode;

        if (statusCode === 404) {
            return 0;
        }

        const data = response.data.findSession;

        if (statusCode === 302) {
            setbuyerUserId(response.data.findSession.id);
            return data;
        }
    }

    const [initiatePackageScene, setinitiatePackageScene] = useState(false);
    const [packagePrice, setpackagePrice] = useState<number | 0>(0);
    const [buyerPointsFetch, setbuyerPointsFetch] = useState<number | 0>(0);
    const [discountPoints, setdiscountPoints] = useState<number | 0>(0);
    const [pointsToUse, setpointsToUse] = useState<number | 0>(0);

    useEffect(() => {
        const data = merchantData?.packagesList.find((item: { _id: Key; }) => item._id === packgeToInitiate);
        setpackagePrice(data?.packagePrice || 0)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packgeToInitiate, discountPoints])


    async function enableInitiateContactScene() {

        setloading(true);

        const response = await checkIfMerchantTryingToInitiateContact();

        setinitiatePackageScene(true);

        if (response === 0) {

            toast.error("Please login to continue", {});
            setinitiatePackageScene(false);
            setloading(false);
            return;

            //! If a merchant tries to inititate, throw erro bcz
            //! Merchants can't initiate contact
        } else if (response.isMerchant) {

            toast.error("Sorry merhchant's can not initiate contact", {});
            setloading(false);
            setinitiatePackageScene(false);

            return;
        }

        const buyerUserName = getCookie('userName');
        const { data: { blytPoints } } = await axios.get(`/api/buyersAPIs/buyerAccountDataFetchUpdateAPI?userName=${buyerUserName}&method=buyerPointsFetch`)
        setbuyerPointsFetch(blytPoints);

        setloading(false);
    }

    const [packageToInitiateErrorMessage, setpackageToInitiateErrorMessage] = useState('');

    async function initiatingTheContact() {
        if (!packgeToInitiate) {
            console.error("Please select a packge to initiate contact")
            return;
        }

        const merchantId = merchantData?._id;

        //! If user tried to use his own referral, then, set referredBy to empty. 
        var referredBy;
        if (referredByUserName === merchantUserName || referredByUserName === userNameCookie) {
            referredBy = '';
        } else {
            referredBy = referredByUserName;
        }

        const data = {
            merchantUserName,
            merchantServiceName,
            merchantBusinessName: merchantData?.businessName,
            merchantId,
            userProfilePic: merchantData?.userProfilePic,
            packgeToInitiate,
            buyerUserId,
            referredBy,
            method: "initiateContact",
            discountPoints
        }

        const response = await axios.post(`/api/ordersAPIs/addUpdateOrderStatus`, data)

        const message = response.data.message;
        const statusCode = response.data.statusCode;

        if (statusCode === 404) {

            window.location.href = '/';
            return;

        } else if (statusCode === 302) {

            setpackageToInitiateErrorMessage(message);
            return;

        } else if (statusCode === 200) {

            setloading(true);
            setinitiatePackageScene(false);

            toast.success(message, {});

            setTimeout(() => {
                router.push(`/buyer/dashboard/${userNameCookie}`)
            }, 2300);
            return;

        }
    }

    const [showMoreData, setshowMoreData] = useState<{ [key: string]: boolean }>({});

    //! Fetch reviews
    const [reviewsList, setreviewsList] = useState<ReviewsList | null>(null);
    const [reviewsPage, setreviewsPage] = useState(1);

    async function fetchReviewsList() {
        const response = await axios.get(`/api/commonAPIs/reviewOrder?userName=${merchantData?.userName}&page=${reviewsPage}`)
        setreviewsList(response.data.fetchingReviews);
    }

    async function saveToLiked() {

        setloading(true);

        if (userNameCookie === merchantData?.userName) {
            toast.error("Uh uh, You can't like your own business.", {});
            setloading(false);
            return;
        }

        const data = { userName: userNameCookie, merchantId: merchantData?._id }

        const response = await axios.post('/api/buyersAPIs/buyerAccountDataFetchUpdateAPI', data);

        if (response.data.statusCode === 404) {
            toast.error(response.data.message, {});
        } else {
            toast.success(response.data.message, {});
            setbuyerLikeIt(!buyerLikeIt);
        }

        setloading(false);
    }

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [showSocialMediaShare, setshowSocialMediaShare] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
                setshowSocialMediaShare(false);
            }
        };

        document.body.addEventListener('click', handleClickOutside);

        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    async function generateReferral() {

        if (userNameCookie === merchantUserName) {
            toast.error('You can`t generate your own referral.', {});
            return;
        }

        const referralLink = `${process.env.NEXT_PUBLIC_DOMAIN_NAME}${pathname}?referral=${userNameCookie}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            toast.success('Referral link copied to clipboard.', {});
            alert('Referral link copied to clipboard: ' + referralLink);
        }).catch((err) => {
            console.error('Error copying to clipboard:', err);
        });
    }

    return (
        <>
            {loading &&
                <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {(!loading || initiatePackageScene) &&
                <section className={`${initiatePackageScene ? "blur-sm pointer-events-none" : ""} merchant-dashboard-section`}>
                    <section style={{ backgroundImage: `url(${serviceBanner})` }} className="merchantBanner bg-[url('/images/MerchantDashboardImages/default-banner-1.jpg')] md:h-72 h-52 bg-cover bg-no-repeat bg-center relative">
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold flex md:gap-20 gap-5 whitespace-nowrap'>
                        </div>
                    </section>
                    <div className="max-width max-w-screen-xl m-auto px-4 flex lg:flex-row flex-col pb-8">
                        {/* Left side merchat absic info section */}
                        <section className="left-side-section">
                            <MerchantLeftSideBoxComponent
                                merchantData={merchantData}
                                userName={userName}
                                copyText={copyText}
                                enableInitiateContactScene={enableInitiateContactScene}
                                userProfilePic={userProfilePic}
                                showEditAddOptions={false}
                                showEditProfilePicIcon={false}
                            />
                        </section>

                        {/* Right side merchant service, packages, & reviews section */}
                        <section className="right-side-section w-full mt-5 lg:ml-5 ml-0">
                            <section className={`${roxboroughcfFont.className} right-side-nav-bar-merchant-public-view flex gap-x-10 gap-y-4 flex-wrap font-bold teeny:text-xl text-base capitalize lg:justify-start justify-center mb-0 items-center`}>
                                <p onClick={() => showTab('service')} className={`${activeTab === 'service' ? "underline underline-offset-8 decoration-[#9F885E] decoration-4 cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>service</p>
                                <p onClick={() => showTab('packages')} className={`${activeTab === 'packages' ? "underline underline-offset-8 decoration-[#9F885E] decoration-4 cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>packages</p>
                                <p onClick={() => { showTab('reviews'); fetchReviewsList(); }} className={`${activeTab === 'reviews' ? "underline underline-offset-8 decoration-[#9F885E] decoration-4 cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>reviews</p>
                                {merchantData?.funding && <p onClick={() => { showTab('funding'); }} className={`${activeTab === 'funding' ? "underline underline-offset-8 decoration-[#9F885E] decoration-4 cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>funding</p>}

                                {!buyerLikeIt ?
                                    <p onClick={saveToLiked} className={`${poppinsFont.className} cursor-pointer bg-[#6D6E72] flex items-center text-white gap-2 font-normal uppercase text-sm tracking-[0.1rem] px-3 py-2 rounded-lg drop-shadow-lg`}>
                                        like <LikesIcon1 width={20} height={20} customCSS={''} />
                                    </p>
                                    :
                                    <p onClick={saveToLiked} className={`${poppinsFont.className} cursor-pointer bg-[#6D6E72] flex items-center text-white gap-2 font-normal uppercase text-sm tracking-[0.1rem] px-3 py-2 rounded-lg drop-shadow-lg`}>
                                        liked <LikesIcon2 width={20} height={20} customCSS={''} />
                                    </p>
                                }

                                <div onClick={() => setshowSocialMediaShare(true)} className={`${poppinsFont.className} cursor-pointer bg-[#6D6E72] flex items-center text-white gap-2 font-normal uppercase text-sm tracking-[0.1rem] px-2 py-2 rounded-lg drop-shadow-lg`}>
                                    share <ShareIcon1 width={20} height={20} customCSS={''} />
                                </div>

                                <ButtonComponent1
                                    onClick={generateReferral}
                                    leftSide={<CrownIcon3 width={36} height={36} customCSS={'sm:w-9 w-5'} />}
                                    middleSide="generate referral"
                                    customButtonCSS="cursor-pointer uppercase flex m-auto text-white !font-bold teeny:gap-4 gap-2 rounded-lg drop-shadow-lg items-center !text-black md:text-lg text-sm bg-[#FFE9CF] md:px-5 px-2 py-3 w-fit" />

                            </section>

                            {/* Services Tab */}
                            {(activeTab === "service" && merchantData?.service.serviceCategory) &&
                                <section className="my-service-section">
                                    {/* About the service */}
                                    <section className="my-service mt-4">
                                        <HeadingComponent1
                                            customCSS="mb-5"
                                            title={'my service'}
                                            lineWidth={'w-[120%]'}
                                            showRightSide={false} />

                                        {/* Desktop & Tablet View */}
                                        <section className="my-service-box-desktop-and-tablet sm:flex hidden">
                                            <section className="display-merchant-service bg-white px-4 py-2 rounded-lg drop-shadow-lg flex sm:flex-row flex-col gap-5 lg:mr-5 mr-0 w-full">

                                                <div className='left-side-data m-auto'>
                                                    {!merchantData?.service.serviceImages[0] ?
                                                        <NoImageIcon1 width={80} height={80} customCSS={'sm:w-20 w-10 rounded-full'} />
                                                        :
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg' width={80} height={80} src={merchantData?.service.serviceImages[0]} alt="" />
                                                    }
                                                </div>

                                                <div className="right-side-data w-full flex flex-col justify-between">
                                                    <div className="top-side flex justify-between">
                                                        <div className="left-side">
                                                            <p className={`${roxboroughcfFont.className} font-bold text-lg`}>{merchantData?.service.serviceName as string}</p>
                                                            <p className='text-sm my-[1px]'>{merchantData?.userFullName as string}</p>
                                                        </div>

                                                        <div className="center-side text-center">
                                                            <p className='text-sm capitalize'>pricing</p>
                                                            <div className='flex gap-1 font-bold'>
                                                                <p>{merchantData?.service.serviceCurrency as string}</p>
                                                                <p>{merchantData?.service.serviceMinPrice as number}</p>
                                                                <p>-</p>
                                                                <p>{merchantData?.service.serviceMaxPrice as number}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='service-and-package-details mt-2'>
                                                        <p className='font-semibold'>{merchantData?.service.serviceName as string}</p>
                                                        <p className='mt-1 leading-5'>{merchantData?.service.serviceDescription as string}</p>
                                                    </div>
                                                </div>

                                            </section>
                                        </section>

                                        {/* Mobile View */}
                                        <section className="my-package-box-desktop-&-tablet sm:hidden flex flex-col mb-5">
                                            <section className="bg-white rounded-lg drop-shadow-lg p-4">
                                                <div className="image">
                                                    {!merchantData?.service.serviceImages ?
                                                        <DefaultProfilePic1 width={80} height={80} customCSS={'w-full rounded-lg drop-shadow-lg'} />
                                                        :
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img className='w-full rounded-lg drop-shadow-lg' width={80} height={80} src={merchantData?.service.serviceImages[0]} alt="" />
                                                    }
                                                </div>

                                                <div className='package-name mt-4'>
                                                    <p className='font-bold text-lg'>{merchantData?.service.serviceName}</p>
                                                </div>

                                                <div className="amount mt-4 capitalize flex flex-col">
                                                    <span className='text-sm font-medium'>pricing</span>
                                                    <span className='font-bold'>{merchantData?.service.serviceCurrency} {merchantData?.service.serviceMinPrice} - {merchantData?.service.serviceMaxPrice}</span>
                                                </div>

                                                <div className="mt-4 text-xs font-medium">
                                                    {merchantData?.service.serviceDescription}
                                                </div>
                                            </section>
                                        </section>
                                    </section>

                                    {/* Service images */}
                                    {merchantData?.service?.serviceImages.length !== 0 &&
                                        <>
                                            <section className="service-gallery mt-10 sm:mr-5 mr-0">
                                                <HeadingComponent1
                                                    customCSS="mb-5"
                                                    title={'gallery'}
                                                    lineWidth={'w-[120%]'}
                                                    showRightSide={false} />

                                                <div className='grid sm:grid-cols-3 teeny:grid-cols-2 grid-cols-1 gap-5 grid-flow-row'>
                                                    {serviceImages.map((items) => {
                                                        return (
                                                            <div key={items}>
                                                                <ImageMagnifier src={items} />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </section>
                                        </>
                                    }

                                    {/* Service video */}
                                    {merchantData?.service?.serviceVideo &&
                                        <div className='flex justify-center mt-10 sm:mr-5 mr-0'>
                                            <video controls className='w-full h-auto rounded-lg drop-shadow-lg'>
                                                <source src={`${merchantData?.service?.serviceVideo}`} type="video/mp4" />
                                            </video>
                                        </div>
                                    }

                                    {/* Service deck */}
                                    {merchantData?.service.serviceDeck &&
                                        <>
                                            <section className="service-deck mt-10">
                                                <HeadingComponent1
                                                    customCSS="mb-5"
                                                    title={'company deck'}
                                                    lineWidth={'w-[120%]'}
                                                    showRightSide={false} />
                                            </section>

                                            <Link href={merchantData?.service.serviceDeck} className="company-deck-download drop-shadow-lg rounded-lg cursor-pointer">
                                                <ButtonComponent1
                                                    middleSide="download pdf"
                                                    rightSide={<PDFIcon1 width={40} height={40} customCSS={''} />}
                                                    customButtonCSS="px-8 py-4 w-fit !m-0" />
                                            </Link>
                                        </>
                                    }
                                </section>
                            }

                            {/* Packages Tab */}
                            {(activeTab === "packages" && merchantData?.packagesList) &&
                                <section className="my-package-section">
                                    {/* About the package */}
                                    <section className="my-package mt-4">
                                        {!merchantData?.packagesList &&
                                            <HeadingComponent1
                                                customCSS="mb-5"
                                                title={'my packages'}
                                                lineWidth={'w-[120%]'}
                                                showRightSide={false} />
                                        }

                                        {merchantData?.packagesList.map((items) => {

                                            const isDescriptionExpanded = showMoreData[items._id] || false;

                                            return (
                                                <div key={items._id}>
                                                    {/* Desktop & Tablet View */}
                                                    <section className="display-first-5-packages-list bg-white px-4 py-2 rounded-lg drop-shadow-lg flex sm:flex-row flex-col gap-5 mb-5 lg:mr-5 mr-0">

                                                        <div className='left-side-data m-auto'>
                                                            {!items?.packageImages[0] ?
                                                                <DefaultProfilePic1 width={80} height={80} customCSS={'sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg'} />
                                                                :
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg' width={80} height={80} src={items?.packageImages[0]} alt="" />
                                                            }
                                                        </div>

                                                        <div className="right-side-data w-full flex flex-col justify-between">
                                                            <div className="top-side flex justify-between gap-1">
                                                                <div className="left-side">
                                                                    <span className="right-side">
                                                                        <p className={`${roxboroughcfFont.className} font-bold xl:text-lg text-base`}>{items?.packageName}</p>
                                                                        <p className='sm:text-sm text-xs'>{items?.packageReviews}</p>
                                                                    </span>
                                                                </div>

                                                                <section className='package-price-range right-side-section capitalize flex flex-col whitespace-nowrap text-center m-auto'>
                                                                    <span className='text-xs'>package price</span>
                                                                    <span className='font-bold text-sm'>{merchantData?.service.serviceCurrency} {items?.packagePrice}</span>
                                                                </section>


                                                            </div>

                                                            <div className='service-and-package-details mt-2'>
                                                                <div className="about-package font-bold sm:text-lg text-sm capitalize">about package</div>
                                                                <div className='package-description sm:text-sm text-xs'>
                                                                    {(!isDescriptionExpanded && (items?.packageDescription as string).length > 200) ?
                                                                        <>
                                                                            {(items?.packageDescription as string).length > 200 ? `${(items?.packageDescription as string).slice(0, 200)}....` : (items?.packageDescription as string)}
                                                                            <button onClick={() => setshowMoreData({ ...showMoreData, [items._id]: true })} className='font-bold'>show more</button>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {items?.packageDescription as string}
                                                                            <button onClick={() => setshowMoreData({ ...showMoreData, [items._id]: false })} className={`${(items?.packageDescription as string).length < 200 ? "hidden " : "block"} font-bold`}>
                                                                                show less
                                                                            </button>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </section>
                                                </div>
                                            )
                                        })}
                                    </section>
                                </section>
                            }

                            {(activeTab === "reviews" && merchantData?.packagesList) &&
                                <>
                                    {reviewsList?.map((items) => (
                                        <section key={items._id}>
                                            <BuyerReviewBox items={items} />
                                        </section>
                                    ))}
                                </>
                            }

                            {(activeTab === "funding" && merchantData?.packagesList) &&
                                <FundingViewComponent items={merchantData.funding} />
                            }
                        </section>
                    </div >
                </section >
            }

            {
                initiatePackageScene &&
                <section className='select-a-package fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-10 py-8 rounded-lg drop-shadow-lg md:min-w-[650px] teeny:min-w-[450px] min-w-[360px]'>

                    <div onClick={() => { setinitiatePackageScene(false); setpackgeToInitiate(''); }} className="cross-icon absolute top-2 right-2 transition-all ease-in-out duration-500 hover:rotate-[360deg]">
                        <CrossIcon1 width={20} height={20} customCSS={''} />
                    </div>

                    <div className='uppercase text-center font-bold text-xl whitespace-nowrap'> select a package </div>

                    <select name="" id="" className='bg-transparent w-full border border-black rounded-lg drop-shadow-lg text-lg my-5 py-2' value={packgeToInitiate} onChange={(e) => { setpackgeToInitiate(e.target.value); }}>
                        <option value=""> Select A Package </option>

                        {merchantData?.packagesList.map((item: PackageListData) => (
                            <option key={item._id} value={item._id}>
                                {item.packageName}
                            </option>
                        ))}

                    </select>

                    <InputComonentForSignInUpPage
                        title={'Enter Points To Get Discount'}
                        image={undefined}
                        inputType={'number'}
                        customTitleCSS={'bg-white'}
                        value={discountPoints as any}
                        onChange={(e: { target: { value: React.SetStateAction<number>; }; }) => setdiscountPoints(e.target.value)} />

                    {discountPoints > packagePrice &&
                        <div className='text-red-500 font-bold text-center pt-2'>
                            Enter Discount Less Than Package Price
                        </div>
                    }

                    <div className='text-end pt-2'> Credits Available: <span className='font-bold'> MYR {buyerPointsFetch} </span> </div>
                    <div className='text-end pt-2'> Price: <span className='font-bold'> MYR {packagePrice} </span> </div>
                    <div className='text-end pt-2'> Discount: <span className='font-bold'> MYR {discountPoints || 0} </span> </div>
                    <div className='text-end pt-2'> Total: <span className='font-bold'> MYR {packagePrice - discountPoints} </span> </div>

                    <p className='mb-5 text-center text-red-600 font-bold'>{packageToInitiateErrorMessage}</p>
                    <button onClick={initiatingTheContact} className={`${!packgeToInitiate ? "pointer-events-none opacity-50" : ""} ${discountPoints > packagePrice ? "pointer-events-none opacity-50" : ""} flex w-fit m-auto bg-[#9F885E] px-8 py-2 rounded-lg drop-shadow-lg text-white font-medium uppercase`}>
                        submit
                    </button>

                </section>
            }

            <ToastContainerUtil />


            {
                showSocialMediaShare &&
                <section className='fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm'>
                    <div ref={sectionRef} className='bg-white rounded-lg drop-shadow-lg px-8 py-4'>
                        <SocialMediaShareButton url={merchantData?.websiteLink || 'https://blyt.world/'} title={'Look what I found on BLYT World:'} socialMedia={'twitter'} />
                    </div>
                </section>
            }
        </>
    );
};

export default MerchantPublicPage;