/* eslint-disable @next/next/no-img-element */
'use client'

import ButtonComponent1 from '@/components/CommonComponents/ButtonComponent1';
import HeadingComponent1 from '@/components/CommonComponents/HeadingComponent1';
import InputComonentForSignInUpPage from '@/components/CommonComponents/InputComonentForSignInUpPage';
import ImageMagnifier from '@/components/ImageMagnifier';
import BuyerReviewBox from '@/components/MerchantBuyerCommonComponents/BuyerReviewBox';
import FundingViewComponent from '@/components/MerchantBuyerCommonComponents/FundingViewComponent';
import VVIPDealsViewComponent from '@/components/MerchantBuyerCommonComponents/VVIPDealsViewComponent';
import MerchantLeftSideBoxComponent from '@/components/MerchantComponents/MerchantLeftSideBoxComponent';
import { poppinsFont, roxboroughcfFont } from '@/fonts/Fonts';
import { CrossIcon1, CrownIcon3, DefaultProfilePic1, DeleteIcon1, EditIcon2, LikesIcon1, LoadingGif, NoImageIcon1, PDFIcon1, ShareIcon1, SignInUpUserIcon1, StarIcon2 } from '@/images/ImagesExport';
import { InitiatedContactsList, MerchantData, ReviewsList } from '@/interfaces/MerchantDashboardInterface';
import axios from 'axios';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { toast } from 'react-toastify';
import { FetchVVIPDeals } from '@/app/vvip-deals/FetchVVIPDeals';
import { getBearerToken } from '@/utils/CommercePayBearerToken';

interface Params {
    slug: string;
    userName: string;
}

interface Crop {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface DeletePackageInterface {
    packageName: string;
    _id: string;
}

const activeButtonCSS = "underline underline-offset-8 decoration-[#9F885E] pointer-events-none";
const inactiveButtonCSS = "text-[#4D4D4D] cursor-pointer";

const MerchantDashboard: React.FC<{ params: Params }> = ({ params }) => {

    const { userName } = params;

    const key = userName + '-homepage-data';
    const now = new Date();

    const [merchantData, setmerchantData] = useState<MerchantData | null>(null);
    const [loading, setloading] = useState(true);
    const [serviceImages, setserviceImages] = useState([]);
    const [userProfilePic, setuserProfilePic] = useState<File | string | null>(null);
    const [serviceBanner, setserviceBanner] = useState('');

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

    async function fetchMerchantPrivateData() {
        setloading(true);

        const response = await axios.get(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName=${userName}`)

        //! First validation if session exist
        const statusCode = response.data.statusCode;
        if (statusCode === 404) {
            window.location.href = "/";
            return;
        }

        //! Then checking if he is merchant
        const isMerchant = response.data.merchantData.isMerchant;
        if (isMerchant === false) {
            window.location.href = "/";
            return;
        }

        //! If both above are false, then, it means the client is merchant, & display his data in the UI
        const data = response.data.merchantData;

        setmerchantData(data)

        setserviceImages(data.service.serviceImages || [])
        setSourceText(data.websiteLink || "");

        setuserProfilePic(data.userProfilePic);

        setserviceBanner(data.service.serviceBanner || "/images/MerchantDashboardImages/default-banner-1.jpg");

        setloading(false);
    }

    //! Setting tab css & showing the tab data on click
    const [activeTab, setActiveTab] = useState('service');
    const showTab = (tabName: string) => {
        setActiveTab(tabName);
    }

    //! Setting deals tab css & showing the tab data on click
    const [dealsActiveTab, setdealsActiveTab] = useState('')
    const showDealsTab = (tabName: string) => {
        setdealsActiveTab(tabName)
    }

    useEffect(() => {
        fetchMerchantPrivateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //! State for profile pic image cropping
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [profilePiccroppedAreaPixels, setprofilePicCroppedAreaPixels] = useState<Area | null>(null);
    const [profilePicimageSrc, setprofilePicImageSrc] = useState<string | null>(null);
    const [isProfilePicCropping, setIsProfilePicCropping] = useState(false);

    //~ Edit Profile Pic    
    const editProfilePic = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg, .jpeg';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {

                if (file.size >= 1000 * 1024) {
                    alert("The file exceed 1MB.")
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    setprofilePicImageSrc(e.target?.result as string);
                    setIsProfilePicCropping(true);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    const onProfilePicCropComplete = useCallback((croppedArea: Area, profilePiccroppedAreaPixels: Area) => {
        setprofilePicCroppedAreaPixels(profilePiccroppedAreaPixels);
    }, []);

    // Function to process cropped image
    const handleProfilePicCrop = async () => {
        if (!profilePicimageSrc || !profilePiccroppedAreaPixels) return;
        try {

            setloading(false);

            setIsProfilePicCropping(false);

            const croppedImageBlob = await getCroppedImg(profilePicimageSrc, profilePiccroppedAreaPixels, rotation);

            const croppedImageURL = URL.createObjectURL(croppedImageBlob);

            const formData = new FormData();

            formData.append("userName", merchantData?.userName as string);
            formData.append("userProfilePic", croppedImageBlob as File);

            try {

                const response = await axios.post('/api/merchantsAPIs/merchantProfilePicAndBannerUpdateAPI', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.statusCode === 404) {
                    window.location.href = "/";
                    return;
                } else if (response.data.statusCode === 200) {
                    toast.success(response.data.message, {});

                    setuserProfilePic(croppedImageURL)

                    await fetchMerchantPrivateData();

                    picCropDefaultFunction();
                } else {
                    toast.error('There is an issue with the image, please upload another image' as any, {});
                }

            } catch (error) {
                toast.error("There is an issue with the image, please upload another image", {});
            }

        } catch (e) {
            console.error(e);
        }
    };

    // Function to get cropped image
    const createProfilePicImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    async function getCroppedImg(profilePicimageSrc: string, pixelCrop: Crop, rotation = 0): Promise<Blob> {
        const image = await createProfilePicImage(profilePicimageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Canvas context not available');
        }

        const { x, y, width, height } = pixelCrop;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(
            image,
            x,
            y,
            width,
            height,
            0,
            0,
            width,
            height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, '.jpg, .jpeg');
        });
    }

    //! Deleting a package
    async function deletePackage(items: DeletePackageInterface) {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${items.packageName} package?`);

        if (!isConfirmed) {
            return;
        }

        const config = {
            data: { userName, id: items?._id, functionToPerform: "deletePackage" }
        };

        const response = await axios.delete('/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI', config);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 206) {
            toast.error(message, {});
            return;
        }

        await fetchMerchantPrivateData();
    }

    const [showMoreData, setshowMoreData] = useState<{ [key: string]: boolean }>({});
    const [verifyOTPScene, setverifyOTPScene] = useState(false)
    const [OTP, setOTP] = useState('');

    //! Update deal status code
    async function updateStatus(status: string) {

        setloading(true);

        const data = { orderId: merchantData?.allOrdersList[0]._id, status }
        const response = await axios.put(`/api/ordersAPIs/addUpdateOrderStatus`, data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            window.location.href = '/';
            return
        } else if (statusCode === 402) {
            setverifyOTPScene(true);
            toast.success(message, {});
            setloading(false);
            return;
        }

        toast.success(message, {});
        fetchMerchantPrivateData();
        setloading(false);
    }

    //! Mark deals as done code
    async function marksAsDoneDeals(status: string) {
        const data = { merchantUserName: merchantData?.userName, buyerUserName: merchantData?.allOrdersList[0].buyerUserName, orderId: merchantData?.allOrdersList[0]._id, status, OTP }

        const response = await axios.patch(`/api/ordersAPIs/addUpdateOrderStatus`, data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            window.location.href = '/';
            return;
        } else if (statusCode === 401) {
            toast.error(message, {});
            return;
        } else if (statusCode === 202) {
            fetchMerchantPrivateData();
            setverifyOTPScene(false);
            setOTP('');
            toast.success(message, {});
            return;
        }
    }

    //! Banner cropping code 
    const [bannercroppedAreaPixels, setbannercroppedAreaPixels] = useState<Area | null>(null);
    const [bannerimageSrc, setbannerImageSrc] = useState<string | null>(null);
    const [isBannerCropping, setisBannerCropping] = useState(false);

    const editBannerPic = async () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg, .jpeg';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {

                if (file.size >= 2000 * 1024) {
                    alert("The file exceed 2MB.")
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    setbannerImageSrc(e.target?.result as string);
                    setisBannerCropping(true);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    const handleBannerCrop = async () => {
        if (!bannerimageSrc || !bannercroppedAreaPixels) return;
        try {

            setloading(false);

            setisBannerCropping(false);

            const croppedImageBlob = await getCroppedImg(bannerimageSrc, bannercroppedAreaPixels, rotation);

            const croppedImageURL = URL.createObjectURL(croppedImageBlob);

            const formData = new FormData();

            formData.append("userName", merchantData?.userName as string);
            formData.append("userBannerPic", croppedImageBlob as File);

            try {
                const response = await axios.post('/api/merchantsAPIs/merchantProfilePicAndBannerUpdateAPI', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data === 404) {
                    window.location.href = "/";
                    return;
                }

                toast.success(response.data.message, {});

                setbannerImageSrc(croppedImageURL)

                setserviceBanner(croppedImageURL)

                picCropDefaultFunction();
            } catch (error) {
                toast.error("There is an issue with the image, please upload another image", {});
            }

        } catch (e) {
            console.error(e);
        }
    };

    const onBannerCropComplete = useCallback((croppedArea: Area, bannercroppedAreaPixels: Area) => {
        setbannercroppedAreaPixels(bannercroppedAreaPixels);
    }, []);

    //! Default function for cropping image
    function picCropDefaultFunction() {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setprofilePicCroppedAreaPixels(null);
        setprofilePicImageSrc(null);
        setIsProfilePicCropping(false);
    }

    async function removeBanner() {

        if (serviceBanner.includes('/image')) {
            return;
        }

        const config = {
            data: { userName }
        };

        try {
            const response = await axios.delete('/api/merchantsAPIs/merchantProfilePicAndBannerUpdateAPI', config);

            if (response.data.statusCode === 404) {
                window.location.href = '/';
            }

            setserviceBanner("/images/MerchantDashboardImages/default-banner-1.jpg");
            toast.error(response.data.message, {});

        } catch (error) {
            toast.error("There is an issue with the image, please upload another image", {});
        }

    }

    //! Fetching all the deals
    const [initiatedContactsList, setinitiatedContactsList] = useState<InitiatedContactsList | null>(null);
    const [workInProgressDealsList, setworkInProgressDealsList] = useState<InitiatedContactsList | null>(null);
    const [doneDealsList, setdoneDealsList] = useState<InitiatedContactsList | null>(null);
    const [verifyOTPScene2, setverifyOTPScene2] = useState(false)

    const [totalPages, settotalPages] = useState(0);
    const [dealsPage, setdealsPage] = useState(0);


    const handlePageChange = (newPage: any) => {
        setdealsPage(newPage);
    };

    async function getInitiatedContactsList(string: string | null, stillFetch?: boolean) {

        if (!stillFetch && string?.replace(/_/g, ' ') === dealsActiveTab) {
            return;
        }

        if (!string) {
            string = dealsActiveTab;
        }

        const response = await axios.get(`/api/merchantsAPIs/merchantFetchOrdersListAPI?userName=${userName}&list=${string}&dealsPages=${dealsPage}`)

        setinitiatedContactsList(null);
        setworkInProgressDealsList(null);
        setdoneDealsList(null);

        if (string === "initiated_contact" || string === "initiated contact") {

            setinitiatedContactsList(response.data.findAllInitiatedContactsList)

        } else if (string === "work_in_progress" || string === "work in progress") {

            setworkInProgressDealsList(response.data.findAllWorkInProgressList)

        } else if (string === "done_deals" || string === "done deals") {

            setdoneDealsList(response.data.findAllDoneDealsList)
        }

        settotalPages(Math.ceil(response.data.totalDocs / 5));
    }

    useEffect(() => {
        if (dealsActiveTab) {
            getInitiatedContactsList(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dealsPage])


    const [buyerUserName, setbuyerUserName] = useState('');
    const [orderId, setorderId] = useState('');

    //! Update deal status code
    async function updateStatus2(status: string, id: string, merchantUserName: string, buyerUserName: string, _id: string) {

        setbuyerUserName(buyerUserName);
        setorderId(_id);

        setloading(true);

        const data = { orderId: id, status }
        const response = await axios.put(`/api/ordersAPIs/addUpdateOrderStatus`, data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            window.location.href = '/';
            return
        } else if (statusCode === 402) {
            setverifyOTPScene2(true);
            setloading(false);
            toast.success(message, {});
            return;
        }

        toast.success(message, {});
        setdealsActiveTab(status)
        getInitiatedContactsList(status.replace(/ /g, "_"));
        setloading(false);
    }

    //! Mark deals as done code
    async function marksAsDoneDeals2(status: string) {
        const data = { merchantUserName: merchantData?.userName, buyerUserName: buyerUserName, orderId: orderId, status, OTP }

        const response = await axios.patch(`/api/ordersAPIs/addUpdateOrderStatus`, data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            // window.location.href = '/';
            return;
        } else if (statusCode === 401) {
            toast.error(message, {});
            return;
        } else if (statusCode === 202) {
            fetchMerchantPrivateData();
            setverifyOTPScene2(false);
            setOTP('');
            setbuyerUserName('');
            setorderId('');
            toast.success(message, {});
            setdealsActiveTab(status)
            getInitiatedContactsList(status.replace(/ /g, "_"));
            return;
        }
    }

    //! Fetch reviews
    const [reviewsList, setreviewsList] = useState<ReviewsList | null>(null);
    const [reviewsPage, setreviewsPage] = useState(1);

    async function fetchReviewsList() {
        const response = await axios.get(`/api/commonAPIs/reviewOrder?userName=${userName}&page=${reviewsPage}`)
        setreviewsList(response.data.fetchingReviews);
    }

    //! Share points to buyer
    const [sharePointsScene, setsharePointsScene] = useState(false);
    const [pointsToShare, setpointsToShare] = useState<number>(0);
    const [buyerId, setbuyerId] = useState('');
    const [merchantId, setmerchantId] = useState('');
    const [pointsSharedOrderId, setpointsSharedOrderId] = useState('');
    const [referredUserName, setreferredUserName] = useState('');
    const [sharePointToWhom, setsharePointToWhom] = useState('');

    async function sharePointsToBuyer(pointsToShare: any, whomToShare: string) {

        if (sharePointsScene) {

            if (pointsToShare <= 0) {
                toast.error("Please put value above 0", {});
                setsharePointsScene(false);
                return;
            }

            if (merchantData?.blytPoints !== undefined && merchantData?.blytPoints <= 0) {
                toast.error('Insufficient funds', {});
                return;
            }

            const bearerToken = await getBearerToken();

            const data = {
                buyerId,
                merchantId,
                userName,
                pointsToShare,
                pointsSharedOrderId,
                whomToShare,
                referredUserName,
                currencyCode: merchantData?.service.serviceCurrency,
                email: merchantData?.userEmail,
                username: merchantData?.userName,
                bearerToken,
                name: merchantData?.userFullName
            }

            //! Show confirmation dialog
            const isConfirmed = window.confirm(`Are you sure you want to give ${pointsToShare} points?`);

            if (!isConfirmed) {
                setsharePointsScene(false);
                setpointsToShare(0);
                return;
            }

            const response = await axios.put('/api/merchantsAPIs/merchantPointsShareAPI/generatePaymentLink', data);

            const statusCode = response.data.statusCode;
            const message = response.data.message;

            if (statusCode === 404) {
                // window.location.href = '/';
                return;
            } else if (statusCode === 403) {
                toast.error(message, {});
            } else if (statusCode === 201) {
                window.location.href = response.data.url;
            }

            getInitiatedContactsList('done_deals', true);
            setpointsToShare(0);
            setsharePointsScene(false);
            return;
        }

        setsharePointsScene(true);
    }

    //! Deleting the deal 
    async function deleteDeal(itemID: string, dealName: string) {
        const isConfirmed = window.confirm(`Are you sure you want to delete ${dealName} package?`);

        if (!isConfirmed) {
            return;
        }

        const config = {
            data: { userName, id: itemID, functionToPerform: "deleteDeal" }
        };

        setloading(true);

        const response = await axios.delete('/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI', config);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 206) {
            toast.error(message, {});
            return;
        }

        await fetchMerchantPrivateData();

        if (merchantData?.dealsList.length !== 1) {
            showTab('VVIP deals');
        } else {
            showTab('service');
        }

        await FetchVVIPDeals(true, true);
    }

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <>
            {loading &&
                <section className="loading-icon absolute w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {isProfilePicCropping && (
                <>
                    <section className='merchant-porfile-pic-change fixed top-0 left-0 right-0 bottom-0 backdrop-blur-3xl'>
                        <div className="cropping-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-[90%] h-1/2">
                            <Cropper
                                image={profilePicimageSrc as any}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onZoomChange={setZoom}
                                onCropComplete={onProfilePicCropComplete}
                                cropShape="round"
                            />
                            <button className='absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-4 py-2 rounded-lg drop-shadow-lg capitalize' onClick={handleProfilePicCrop}>done</button>
                            <button className='absolute -bottom-24 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-4 py-2 rounded-lg drop-shadow-lg capitalize' onClick={() => setIsProfilePicCropping(false)}>cancel</button>
                        </div>
                    </section>
                </>
            )}

            {isBannerCropping && (
                <>
                    <section className='merchant-banner-pic-change fixed top-0 left-0 right-0 bottom-0 backdrop-blur-3xl'>
                        <div className="cropping-container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-[90%] h-1/2">
                            <Cropper
                                image={bannerimageSrc as any}
                                crop={crop}
                                rotation={rotation}
                                zoom={zoom}
                                aspect={1440 / 288} // Ensure this aspect ratio is maintained in the cropping area
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onZoomChange={setZoom}
                                onCropComplete={onBannerCropComplete}
                                cropShape="rect" // This should create a rectangular crop, not a circle
                            />
                            <button className='absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-4 py-2 rounded-lg drop-shadow-lg capitalize' onClick={handleBannerCrop}>done</button>
                            <button className='absolute -bottom-24 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-4 py-2 rounded-lg drop-shadow-lg capitalize' onClick={() => setisBannerCropping(false)}>cancel</button>
                        </div>
                    </section>
                </>
            )}

            {(!loading && !isProfilePicCropping && !verifyOTPScene && !verifyOTPScene2 && !isBannerCropping && !sharePointsScene) &&
                <section className="merchant-dashboard-section">
                    <section style={{ backgroundImage: `url(${serviceBanner})` }} className={`merchantBanner md:h-72 h-52 bg-cover bg-no-repeat bg-center relative`}>
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold flex md:gap-20 gap-5 whitespace-nowrap'>
                            <button onClick={editBannerPic}><ButtonComponent1 middleSide="replace image" customButtonCSS="bg-[#9F885E] md:px-8 px-4 py-2 uppercase rounded-lg drop-shadow-lg md:text-base text-xs !font-bold" /></button>
                            <button onClick={removeBanner} className={`uppercase md:text-base text-xs`}>remove</button>
                        </div>
                    </section>
                    <div className="max-width max-w-screen-xl m-auto px-4 flex lg:flex-row flex-col pb-8">
                        {/* Left side merchat absic info section */}
                        <section className="left-side-section">

                            <MerchantLeftSideBoxComponent
                                merchantData={merchantData}
                                userName={userName}
                                copyText={copyText}
                                editProfilePic={editProfilePic}
                                userProfilePic={userProfilePic}
                                showEditAddOptions={true}
                                showEditProfilePicIcon={true}
                                refreshData={fetchMerchantPrivateData}
                            />

                        </section>

                        {/* Right side merchant service, packages, & reviews section */}
                        <section className="right-side-section w-full mt-5 lg:ml-5 ml-0">
                            <section className={`${roxboroughcfFont.className} font-bold right-side-nav-bar-merchant-dashboard flex gap-10 teeny:text-xl text-base capitalize lg:justify-start justify-center`}>
                                {merchantData?.service.serviceImages.length !== 0 && <p onClick={() => showTab('service')} className={`${activeTab === 'service' ? activeButtonCSS : inactiveButtonCSS}`}>service</p>}
                                {merchantData?.packagesList.length !== 0 && <p onClick={() => showTab('packages')} className={`${activeTab === 'packages' ? activeButtonCSS : inactiveButtonCSS}`}>packages</p>}
                                {merchantData?.totalReviewsCount !== 0 && <p onClick={() => { showTab('reviews'); fetchReviewsList(); }} className={`${activeTab === 'reviews' ? activeButtonCSS : inactiveButtonCSS}`}>reviews</p>}
                                {merchantData?.allOrdersList.length !== 0 && <p onClick={() => { showTab('deals'); getInitiatedContactsList('initiated_contact'); showDealsTab('initiated contact'); }} className={`${activeTab === 'deals' ? activeButtonCSS : inactiveButtonCSS}`}>deals</p>}
                                {merchantData?.funding && <p onClick={() => { showTab('funding'); }} className={`${activeTab === 'funding' ? activeButtonCSS : inactiveButtonCSS}`}>funding</p>}
                                {merchantData?.dealsList.length !== 0 && <p onClick={() => { showTab('VVIP deals'); }} className={`${activeTab === 'VVIP deals' ? activeButtonCSS : inactiveButtonCSS}`}>VVIP deals</p>}
                            </section>

                            <section className={`font-semibold  buttons-section capitalize whitespace-nowrap flex flex-wrap my-4 teeny:gap-5 gap-2 lg:justify-start justify-center`}>
                                <ButtonComponent1
                                    leftSide={<CrownIcon3 width={36} height={36} customCSS={'sm:w-9 w-5'} />}
                                    middleSide="get funding"
                                    customButtonCSS="uppercase flex m-auto text-white !font-bold teeny:gap-4 gap-2 rounded-lg drop-shadow-lg items-center !text-black md:text-lg text-sm bg-[#FFE9CF] md:px-5 px-2 py-3 w-fit" />
                                <ButtonComponent1
                                    leftSide={<CrownIcon3 width={36} height={36} customCSS={'sm:w-9 w-5'} />}
                                    middleSide="apply for ad space"
                                    customButtonCSS="uppercase flex m-auto text-white !font-bold teeny:gap-4 gap-2 rounded-lg drop-shadow-lg items-center !text-black md:text-lg text-sm bg-[#FFE9CF] md:px-5 px-2 py-3 w-fit" />
                                <ButtonComponent1
                                    leftSide={<CrownIcon3 width={36} height={36} customCSS={'sm:w-9 w-5'} />}
                                    middleSide="generate referral"
                                    customButtonCSS="uppercase flex m-auto text-white !font-bold teeny:gap-4 gap-2 rounded-lg drop-shadow-lg items-center !text-black md:text-lg text-sm bg-[#FFE9CF] md:px-5 px-2 py-3 w-fit" />
                            </section>


                            {/* Latest ongoing deal section */}
                            {(activeTab === "service" && merchantData?.allOrdersList.length !== 0) &&
                                <section className='latest-ongoing-deal mt-10'>
                                    <HeadingComponent1
                                        customCSS="mb-5 lg:mr-5 mr-0"
                                        title={'latest deal'}
                                        lineWidth={'w-[120%]'}
                                        showRightSide={false} />

                                    <section className="display-latest-order bg-white px-4 py-2 rounded-lg drop-shadow-lg flex sm:flex-row flex-col gap-5 lg:mr-5 mr-0">

                                        <div className='left-side-data m-auto'>

                                            {merchantData?.allOrdersList[0].packageImage ?

                                                <img
                                                    className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg'
                                                    width={250}
                                                    height={140}
                                                    src={merchantData?.allOrdersList[0].packageImage}
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/images/CommonImages/no-image-icon-1.png';
                                                        e.currentTarget.width = 80;
                                                        e.currentTarget.height = 80;
                                                    }}
                                                    alt="Order package"
                                                />
                                                :
                                                <NoImageIcon1 width={80} height={80} customCSS={'sm:min-w-[150px] sm:w-0 w-96 rounded-lg drop-shadow-lg'} />
                                            }

                                        </div>

                                        <div className="right-side-data w-full flex flex-col justify-between">
                                            <div className="top-side flex justify-between">
                                                <div className="left-side">
                                                    <p className={`${roxboroughcfFont.className} font-bold text-lg`}>{merchantData?.allOrdersList[0].buyerFullName as string}</p>
                                                    <p className='font-medium text-sm my-[1px]'>{merchantData?.allOrdersList[0].buyerUserName as string}</p>
                                                    {merchantData?.allOrdersList[0].orderStatus !== 'done deals' ?
                                                        <div className="right-side flex items-start text-sm ">
                                                            <p className='font-bold capitalize'>order status:</p>
                                                            <select name="" id="" className='capitalize' value={merchantData?.allOrdersList[0].orderStatus} onChange={(e: { target: { value: any; }; }) => { updateStatus(e.target.value) }}>
                                                                <option value="" disabled>update status</option>
                                                                <option value="initiated contact" >initiated contact</option>
                                                                <option value="work in progress" >work in progress</option>
                                                                <option value="done deals" >done deals</option>
                                                            </select>
                                                        </div>
                                                        :
                                                        <div className='capitalize'>
                                                            <span className='font-bold'>order status:</span> <span>{merchantData?.allOrdersList[0].orderStatus}</span>
                                                        </div>
                                                    }
                                                </div>

                                                <div className="center-side text-center">
                                                    <p className='text-sm capitalize font-medium'>amount</p>
                                                    <p className='font-bold'>{merchantData?.service.serviceCurrency as string} - {merchantData?.allOrdersList[0].packageAmount as string}</p>
                                                </div>
                                            </div>

                                            <div className='service-and-package-details mt-2'>
                                                <p className='font-semibold'>{merchantData?.allOrdersList[0].packageName as string}</p>
                                                <p className='text-xs my-1'>{merchantData?.allOrdersList[0].serviceName as string}</p>
                                                <p className='text-sm leading-4'>
                                                    {(merchantData?.allOrdersList[0].packageDescription as string).length > 200 ? `${(merchantData?.allOrdersList[0].packageDescription as string).slice(0, 150)}....` : (merchantData?.allOrdersList[0].packageDescription as string)}
                                                </p>
                                            </div>
                                        </div>

                                    </section>
                                </section>
                            }

                            {(activeTab === "service" && merchantData?.service.serviceImages.length !== 0) &&
                                <section className="my-service-section">

                                    {/* About the service */}
                                    <section className="my-service mt-10">
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
                                                        <NoImageIcon1 width={80} height={80} customCSS={'sm:min-w-[150px] sm:w-0 w-96 rounded-lg drop-shadow-lg'} />
                                                        :
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg' width={80} height={80} src={merchantData?.service.serviceImages[0]} alt="" />
                                                    }
                                                </div>

                                                <div className="right-side-data w-full flex flex-col justify-between">
                                                    <div className="top-side flex justify-between">
                                                        <div className="left-side">
                                                            <p className={`${roxboroughcfFont.className} font-bold text-lg`}>{merchantData?.service.serviceName as string}</p>
                                                            <p className='font-medium text-sm my-[1px]'>{merchantData?.userFullName as string}</p>
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
                                                        <p className='mt-1 leading-5 font-normal'>
                                                            {!isDescriptionExpanded && (merchantData?.service.serviceDescription?.toString() || '').length > 200 ? (
                                                                <>
                                                                    {`${(merchantData?.service.serviceDescription || '').slice(0, 200)}....`}
                                                                    <button onClick={() => setIsDescriptionExpanded(true)} className='font-bold'>show more</button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {merchantData?.service.serviceDescription}
                                                                    {(merchantData?.service.serviceDescription?.toString() || '').length > 200 &&
                                                                        <button onClick={() => setIsDescriptionExpanded(false)} className={`${(merchantData?.service.serviceDescription || '').length < 200 ? "hidden " : "block"} font-bold`}>
                                                                            show less
                                                                        </button>
                                                                    }
                                                                </>
                                                            )}
                                                        </p>
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

                                                                <section className="edit-delete-package flex flex-col gap-1 my-auto">
                                                                    <Link href={`/merchant/dashboard/${userName}/edit-a-package/${items._id}`} className='cursor-pointer'> <EditIcon2 width={25} height={25} customCSS={'p-[3px]'} /> </Link>
                                                                    <span className='cursor-pointer' onClick={() => deletePackage(items as DeletePackageInterface)}> <DeleteIcon1 width={25} height={25} customCSS={''} /> </span>
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

                            {/* Reviews tab */}
                            {(activeTab === "reviews" && merchantData?.service.serviceCategory) && (
                                <>
                                    {reviewsList?.map((items) => (
                                        <section key={items._id}>
                                            <BuyerReviewBox items={items} />
                                        </section>
                                    ))}
                                </>
                            )}


                            {/* Deals Tab */}
                            {(activeTab === "deals" && merchantData?.packagesList) &&
                                <section className={`${roxboroughcfFont.className} font-bold nav-bar-for-deals flex teeny:text-xl text-base capitalize justify-between text-center mb-4 lg:mr-5 mr-0`}>
                                    <p onClick={() => { showDealsTab('initiated contact'); getInitiatedContactsList('initiated_contact'); }} className={`${dealsActiveTab === 'initiated contact' ? activeButtonCSS : inactiveButtonCSS}`}>initiated contact</p>
                                    <p onClick={() => { showDealsTab('work in progress'); getInitiatedContactsList('work_in_progress') }} className={`${dealsActiveTab === 'work in progress' ? activeButtonCSS : inactiveButtonCSS}`}>work in progress</p>
                                    <p onClick={() => { showDealsTab('done deals'); getInitiatedContactsList('done_deals') }} className={`${dealsActiveTab === 'done deals' ? activeButtonCSS : inactiveButtonCSS}`}>done deals</p>
                                </section>
                            }

                            {(activeTab === "deals" && dealsActiveTab === "initiated contact" && initiatedContactsList) &&
                                <>
                                    {initiatedContactsList.map((items) => {
                                        return (
                                            <section key={items._id} className="display-work-in-progress-orders bg-white px-4 py-2 rounded-lg drop-shadow-lg flex sm:flex-row flex-col gap-5 lg:mr-5 mr-0 mb-4">

                                                <div className='left-side-data m-auto'>

                                                    <img
                                                        className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg'
                                                        width={250}
                                                        height={140}
                                                        src={items?.packageImage}
                                                        alt="Order package"
                                                    />

                                                </div>

                                                <div className="right-side-data w-full flex flex-col justify-between">
                                                    <div className="top-side flex justify-between">
                                                        <div className="left-side">
                                                            <p className={`${roxboroughcfFont.className} font-bold text-lg`}>{items.buyerFullName as string}</p>
                                                            <p className='text-sm my-[1px]'>{items.buyerUserName as string}</p>
                                                            {items.orderStatus !== 'done deals' ?
                                                                <div className="right-side flex items-start text-sm ">
                                                                    <p className='font-bold capitalize'>order status:</p>
                                                                    <select name="" id="" className='capitalize' value={items.orderStatus}
                                                                        onChange={(e: { target: { value: any; }; }) => { updateStatus2(e.target.value, items._id, items.merchantUserName, items.buyerUserName, items._id) }}>
                                                                        <option value="" disabled>update status</option>
                                                                        <option value="initiated contact" >initiated contact</option>
                                                                        <option value="work in progress" >work in progress</option>
                                                                        <option value="done deals" >done deals</option>
                                                                    </select>
                                                                </div>
                                                                :
                                                                <div className='capitalize'>
                                                                    <span className='font-bold'>order status:</span> <span>{items.orderStatus}</span>
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="center-side text-center">
                                                            <p className='text-sm capitalize'>amount</p>
                                                            <p className='font-bold'>{items.serviceCurrency as string} - {items.packageAmount as string}</p>
                                                        </div>
                                                    </div>

                                                    <div className='service-and-package-details mt-2'>
                                                        <p className='font-semibold'>{items.packageName as string}</p>
                                                        <p className='text-xs my-1'>{items.serviceName as string}</p>
                                                        <p className='text-sm leading-4'>
                                                            {(items.packageDescription as string).length > 200 ? `${(items.packageDescription as string).slice(0, 150)}....` : (items.packageDescription as string)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </section>
                                        )
                                    })}

                                    {/* Pagination Buttons */}
                                    {initiatedContactsList.length !== 0 &&
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
                                </>
                            }

                            {(activeTab === "deals" && dealsActiveTab === "work in progress" && workInProgressDealsList) &&
                                <>
                                    {workInProgressDealsList?.map((items) => {
                                        return (
                                            <section key={items._id} className="display-initiated-contacts-order bg-white px-4 py-2 rounded-lg drop-shadow-lg flex sm:flex-row flex-col gap-5 lg:mr-5 mr-0 mb-4">

                                                <div className='left-side-data m-auto'>

                                                    <img
                                                        className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg'
                                                        width={250}
                                                        height={140}
                                                        src={items?.packageImage}
                                                        alt="Order package"
                                                    />

                                                </div>

                                                <div className="right-side-data w-full flex flex-col justify-between">
                                                    <div className="top-side flex justify-between">
                                                        <div className="left-side">
                                                            <p className={`${roxboroughcfFont.className} font-bold text-lg`}>{items.buyerFullName as string}</p>
                                                            <p className='text-sm my-[1px]'>{items.buyerUserName as string}</p>
                                                            {items.orderStatus !== 'done deals' ?
                                                                <div className="right-side flex items-start text-sm ">
                                                                    <p className='font-bold capitalize'>order status:</p>
                                                                    <select name="" id="" className='capitalize' value={items.orderStatus}
                                                                        onChange={(e: { target: { value: any; }; }) => { updateStatus2(e.target.value, items._id, items.merchantUserName, items.buyerUserName, items._id) }}>
                                                                        <option value="" disabled>update status</option>
                                                                        <option value="initiated contact" >initiated contact</option>
                                                                        <option value="work in progress" >work in progress</option>
                                                                        <option value="done deals" >done deals</option>
                                                                    </select>
                                                                </div>
                                                                :
                                                                <div className='capitalize'>
                                                                    <span className='font-bold'>order status:</span> <span>{items.orderStatus}</span>
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="center-side text-center">
                                                            <p className='text-sm capitalize'>amount</p>
                                                            <p className='font-bold'>{items.serviceCurrency as string} - {items.packageAmount as string}</p>
                                                        </div>
                                                    </div>

                                                    <div className='service-and-package-details mt-2'>
                                                        <p className='font-semibold'>{items.packageName as string}</p>
                                                        <p className='text-xs my-1'>{items.serviceName as string}</p>
                                                        <p className='text-sm leading-4'>
                                                            {(items.packageDescription as string).length > 200 ? `${(items.packageDescription as string).slice(0, 150)}....` : (items.packageDescription as string)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </section>
                                        )
                                    })}

                                    {/* Pagination Buttons */}
                                    {workInProgressDealsList.length !== 0 &&
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
                                </>
                            }

                            {(activeTab === "deals" && dealsActiveTab === "done deals" && doneDealsList) &&
                                <>
                                    {doneDealsList?.map((items: InitiatedContactsList) => {
                                        return (
                                            <section key={items._id} className="display-done-deals-orders bg-white px-4 py-2 rounded-lg drop-shadow-lg flex sm:flex-row flex-col gap-5 lg:mr-5 mr-0 mb-4">

                                                <div className='left-side-data m-auto'>

                                                    {items.packageImage ?
                                                        <img
                                                            className='sm:min-w-[250px] sm:w-0 w-96 rounded-lg drop-shadow-lg'
                                                            src={items.packageImage}
                                                            alt="Order package"
                                                        />
                                                        :
                                                        <NoImageIcon1 width={80} height={80} customCSS={'sm:min-w-[150px] sm:w-0 w-96 rounded-lg drop-shadow-lg'} />
                                                    }

                                                </div>

                                                <div className="right-side-data w-full flex flex-col justify-between">
                                                    <div className="top-side flex justify-between">
                                                        <div className="left-side">
                                                            <p className={`${roxboroughcfFont.className} font-bold text-lg`}>{items.buyerFullName as string}</p>
                                                            <p className='text-sm my-[1px]'>{items.buyerUserName as string}</p>
                                                            {items.orderStatus !== 'done deals' ?
                                                                <div className="right-side flex items-start text-sm ">
                                                                    <p className='font-bold capitalize'>order status:</p>
                                                                    <select name="" id="" className='capitalize' value={items.orderStatus}
                                                                        onChange={(e: { target: { value: any; }; }) => { updateStatus2(e.target.value, items._id, items.merchantUserName, items.buyerUserName, items._id) }}>
                                                                        <option value="" disabled>update status</option>
                                                                        <option value="initiated contact" >initiated contact</option>
                                                                        <option value="work in progress" >work in progress</option>
                                                                        <option value="done deals" >done deals</option>
                                                                    </select>
                                                                </div>
                                                                :
                                                                <div className='capitalize'>
                                                                    <span className='font-bold'>order status:</span> <span>{items.orderStatus}</span>
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="center-side text-center flex flex-col">
                                                            <p className='text-sm capitalize'>amount</p>
                                                            <p className='font-bold'>{items.serviceCurrency as string} - {items.packageAmount as number}</p>

                                                            {items.isPointsShared === false ?
                                                                <button onClick={() => { setsharePointToWhom('buyer'); setpointsSharedOrderId(items._id); setbuyerId(items.buyerId); setmerchantId(items.merchantId); sharePointsToBuyer(0, sharePointToWhom); }} className='capitalize font-bold'>
                                                                    <ButtonComponent1 middleSide={'share points to buyer'} customButtonCSS={'px-1 py-1 text-xs'} />
                                                                </button>
                                                                :
                                                                <p className='capitalize text-xs'><span className='font-bold'> shared points to buyer: </span> {items.pointsShared}</p>
                                                            }

                                                            {(items.referredBy && !items.isPointsSharedToReferred) ?
                                                                <button onClick={() => { setsharePointToWhom('referred'); setreferredUserName(items.referredBy); setpointsSharedOrderId(items._id); setbuyerId(items.buyerId); setmerchantId(items.merchantId); sharePointsToBuyer(0, sharePointToWhom); }} className='capitalize font-bold mt-1'>
                                                                    <ButtonComponent1 middleSide={'share points to referred'} customButtonCSS={'px-1 py-1 text-xs'} />
                                                                </button>
                                                                :
                                                                <p className='capitalize text-xs'><span className='font-bold'> shared points to referred: </span> {items.pointsSharedToReferred}</p>
                                                            }

                                                        </div>
                                                    </div>

                                                    <div className='service-and-package-details mt-2'>
                                                        <p className='font-semibold'>{items.packageName as string}</p>
                                                        <p className='text-xs my-1'>{items.serviceName as string}</p>
                                                        <p className='text-sm leading-4'>
                                                            {(items.packageDescription as string).length > 200 ? `${(items.packageDescription as string).slice(0, 150)}....` : (items.packageDescription as string)}
                                                        </p>
                                                    </div>
                                                </div>

                                            </section>
                                        )
                                    })}

                                    {/* Pagination Buttons */}
                                    {doneDealsList.length !== 0 &&
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
                                </>
                            }

                            {(activeTab === "funding" && merchantData?.packagesList) &&
                                <FundingViewComponent items={merchantData.funding} />
                            }

                            {(activeTab === "VVIP deals" && merchantData?.dealsList) &&
                                <>
                                    <section className="my-service mt-10">
                                        <HeadingComponent1
                                            customCSS="mb-5"
                                            title={'my VVIP deals'}
                                            lineWidth={'w-[120%]'}
                                            showRightSide={false} />
                                        <div className='flex flex-wrap md:justify-between justify-center gap-10'>
                                            <VVIPDealsViewComponent
                                                dealsList={merchantData?.dealsList}
                                                deleteDeal={(itemID, dealName) => deleteDeal(itemID, dealName)}
                                            />
                                        </div>
                                    </section>
                                </>
                            }
                        </section>
                    </div>
                </section>
            }

            {verifyOTPScene &&
                <div className='w-full h-full fixed backdrop-blur-sm top-0'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F5] px-5 py-10 rounded-lg'>

                        <div className='verifyOTPScene text-center capitalize font-bold whitespace-nowrap'>enter OTP to completed deal</div>
                        <div className='my-4'>
                            <InputComonentForSignInUpPage
                                title="OTP"
                                image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={OTP}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setOTP(e.target.value)} />
                        </div>
                        <div className='cursor-pointer w-1/2 flex justify-center mx-auto' onClick={() => marksAsDoneDeals('done deals')}>
                            <ButtonComponent1
                                leftSide={undefined}
                                middleSide={'verify'}
                                rightSide={undefined}
                                customSectionCSS={'w-full'}
                                customButtonCSS={'w-full flex justify-center'}
                            />
                        </div>
                    </div>
                </div>
            }

            {verifyOTPScene2 &&
                <div className='w-full h-full fixed backdrop-blur-sm top-0'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F5] px-5 py-10 rounded-lg'>

                        <div className='verifyOTPScene2 text-center capitalize font-bold whitespace-nowrap'>enter OTP to completed deal</div>
                        <div className='my-4'>
                            <InputComonentForSignInUpPage
                                title="OTP"
                                image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                inputType="name"
                                value={OTP}
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setOTP(e.target.value)} />
                        </div>
                        <div className='cursor-pointer w-1/2 flex justify-center mx-auto' onClick={() => marksAsDoneDeals2('done deals')}>
                            <ButtonComponent1
                                leftSide={undefined}
                                middleSide={'verify'}
                                rightSide={undefined}
                                customSectionCSS={'w-full'}
                                customButtonCSS={'w-full flex justify-center'}
                            />
                        </div>
                    </div>
                </div>
            }

            {sharePointsScene &&
                <div className='w-full h-full fixed backdrop-blur-sm top-0'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5F5F5] px-5 py-10 rounded-lg'>
                        <div onClick={() => { setsharePointsScene(false); setpointsToShare(0); }} className='absolute top-2 right-2'><CrossIcon1 width={20} height={20} customCSS={''} /></div>
                        <div className='text-center capitalize font-bold whitespace-nowrap'>enter points to share</div>
                        <div className='my-4'>
                            <InputComonentForSignInUpPage
                                title="Points"
                                image={`MYR`}
                                inputType="number"
                                value={pointsToShare.toString()}  // Convert the number to a string for the input value
                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) =>
                                    setpointsToShare(Number(e.target.value))  // Convert the string back to a number for state update
                                }
                                customInputCSS='!pl-12'
                            />
                        </div>
                        <div className='cursor-pointer w-1/2 flex justify-center mx-auto' onClick={() => sharePointsToBuyer(pointsToShare, sharePointToWhom)}>
                            <ButtonComponent1
                                leftSide={undefined}
                                middleSide={'share'}
                                rightSide={undefined}
                                customSectionCSS={'w-full'}
                                customButtonCSS={'w-full flex justify-center'}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default MerchantDashboard