'use client'

import LatestOrderViewBoxComponent from "@/components/BuyerDashboardComponents/LatestOrderViewBoxComponent";
import HeadingComponent1 from "@/components/CommonComponents/HeadingComponent1";
import { BecomeAMerchantBanner, CrownIcon4, DefaultProfilePic1, EditIcon2, LoadingGif } from "@/images/ImagesExport";
import { LatestOrderData, MerchantData } from "@/interfaces/MerchantDashboardInterface";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cropper, { Area } from 'react-easy-crop';
import { poppinsFont, roxboroughcfFont } from '../../../../fonts/Fonts'


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

const roxboroughcfFontCSS = `${roxboroughcfFont.className} font-bold`;
const TabActiveCSS = `underline underline-offset-8 decoration-[3px] decoration-[#9F885E] ${roxboroughcfFontCSS}`;
const TabInactiveCSS = `text-[#4D4D4D] cursor-pointer ${roxboroughcfFontCSS}`;

const BuyerDashboard: React.FC<{ params: Params }> = ({ params }) => {

    const { userName } = params;

    const [buyerData, setbuyerData] = useState<MerchantData | null>(null);
    const [latestOrderData, setlatestOrderData] = useState<LatestOrderData[] | null>(null);

    //!! User profile pic logic starts here

    //! State for profile pic image cropping
    const [userProfilePic, setuserProfilePic] = useState<File | string | null>(null);
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

            formData.append("userName", buyerData?.userName as string);
            formData.append("userProfilePic", croppedImageBlob as File);

            try {
                const response = await axios.post('/api/buyersAPIs/buyerProfilePicUpdateAPI', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data === 404) {
                    window.location.href = "/";
                    return;
                } else if (response.data.statusCode === 413) {
                    toast.error(response.data.message, {});
                    return;
                }

                toast.success(response.data.message, {});

                setuserProfilePic(croppedImageURL)

                setloading(false);
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

    //!! Update user profile pic logic ends here

    const [loading, setloading] = useState(true)

    const fetchMerchantPrivateData = useCallback(async () => {

        setloading(true);

        const response = await axios.get(`/api/buyersAPIs/buyerAccountDataFetchUpdateAPI?userName=${userName}`);
        // //! First validation if session exist
        const statusCode = response.data.statusCode;
        if (statusCode === 404) {
            window.location.href = "/";
            return;
        }

        // //! Then checking if he is merchant
        const isMerchant = response.data.buyerData.isMerchant;

        if (isMerchant === true) {
            window.location.href = "/";
            return;
        }

        const buyerData = response.data.buyerData;

        setbuyerData(buyerData);
        setuserProfilePic(buyerData.userProfilePic)

        const ordersList = response.data.orders;
        setlatestOrderData(ordersList);

        setloading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);

    useEffect(() => {
        fetchMerchantPrivateData();
    }, [fetchMerchantPrivateData]);

    //! Setting tab css & showing the tab data on click
    const [activeTab, setActiveTab] = useState('deals');
    const showTab = (tabName: string) => {
        setActiveTab(tabName);
    }

    return (
        <>
            {loading &&
                <section className="loading-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {isProfilePicCropping && (
                <>
                    <section className='buyer-profile-pic-change fixed top-0 left-0 right-0 bottom-0 backdrop-blur-3xl'>
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
                            <button className='absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-4 py-2 rounded-lg drop-shadow-lg capitalize' onClick={handleProfilePicCrop}>crop image</button>
                            <button className='absolute -bottom-24 left-1/2 -translate-x-1/2 bg-black text-white font-bold px-4 py-2 rounded-lg drop-shadow-lg capitalize' onClick={() => setIsProfilePicCropping(false)}>cancel</button>
                        </div>
                    </section>
                </>
            )}

            {(!loading && !isProfilePicCropping) &&
                <section className="buyer-dashboard-section max-w-screen-xl px-4 mx-auto mt-8">
                    <section className="max-width flex lg:flex-row flex-col gap-10">

                        <section className="left-side flex flex-col mx-auto">
                            <section className="about-user text-center sm:min-w-[384px] min-w-0 max-w-[384px] flex flex-col gap-y-3 py-4 bg-white rounded-lg drop-shadow-lg">

                                <div className="buyer-profile-box flex justify-center">
                                    {/* Existing profile box content */}
                                    <div className='relative'>
                                        <div onClick={editProfilePic} className="edit-profile-pic-icon absolute top-0 right-3 cursor-pointer bg-white">
                                            <EditIcon2 width={20} height={20} customCSS={''} />
                                        </div>
                                        {userProfilePic ?
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={userProfilePic as string} alt="Profile" className="rounded-full" width={120} height={120} />
                                            :
                                            <DefaultProfilePic1 width={120} height={120} customCSS={'rounded-full'} />
                                        }
                                    </div>
                                </div>

                                <p className={`${roxboroughcfFontCSS} username text-xl`}>{buyerData?.userFullName}</p>
                                <p className={`${poppinsFont.className} font-medium active-since capitalize`}>active since: {buyerData?.createdAt && new Date(buyerData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\s/g, '-')}</p>
                                <section className="bizz-points-value bg-[#FFF4E7] mx-8 p-2 border border-[#9F885E] rounded-lg drop-shadow-lg flex items-center justify-between">
                                    <div><CrownIcon4 width={53} height={53} customCSS={""} /></div>
                                    <div className={`${roxboroughcfFontCSS} text-xl text-[#3C515D]`}>BLYT credits: <span>{buyerData?.blytPoints}</span></div>
                                    <div></div>
                                </section>
                            </section>

                            <section className="mt-10 cursor-pointer">
                                <BecomeAMerchantBanner width={381} height={135} customCSS={""} />
                            </section>
                        </section>

                        <section className="right-side w-full lg:mt-4 mt-0">
                            <section className="nav-bar-section capitalize flex flex-wrap gap-5 font-bold mb-8 lg:justify-start justify-around">
                                <p onClick={() => showTab('deals')} className={`${activeTab === 'deals' ? TabActiveCSS : TabInactiveCSS}`}>deals</p>
                                <p onClick={() => showTab('communities')} className={`${activeTab === 'communities' ? TabActiveCSS : TabInactiveCSS}`}>communities</p>
                                <p onClick={() => showTab('redeem')} className={`${activeTab === 'redeem' ? TabActiveCSS : TabInactiveCSS}`}>redeem</p>
                                <p onClick={() => showTab('favourites')} className={`${activeTab === 'favourites' ? TabActiveCSS : TabInactiveCSS}`}>favourites</p>
                                <p onClick={() => showTab('points history')} className={`${activeTab === 'points history' ? TabActiveCSS : TabInactiveCSS}`}>points history</p>
                            </section>

                            {activeTab === 'deals' &&
                                <section className="deals-section">
                                    <section className="initiate-contacts-section">
                                        <HeadingComponent1
                                            title={"initiated contacts"}
                                            lineWidth={"w-[120%]"}
                                            showRightSide={true}
                                            customCSS={`${roxboroughcfFontCSS} !mb-0 lg:mr-5 mr-0`}
                                            linkHref={`/buyer/dashboard/orders/${userName}`}
                                        />
                                        {
                                            latestOrderData && latestOrderData.length > 0 ? (
                                                latestOrderData.some(items => items.orderStatus === "initiated contact") ? (
                                                    latestOrderData.map((items) => {
                                                        if (items.orderStatus === "initiated contact") {
                                                            return (
                                                                <div key={items._id}>
                                                                    <LatestOrderViewBoxComponent
                                                                        itemsList={items}
                                                                        barColor={"9F885E"}
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                ) : (
                                                    <div className="no-orders my-4">no orders</div>
                                                )
                                            ) : (
                                                <div className="no-orders my-4">no orders</div>
                                            )
                                        }
                                    </section>

                                    <section className="work-in-porgress-section">
                                        <HeadingComponent1
                                            title={"work in progress"}
                                            lineWidth={"w-[120%]"}
                                            showRightSide={true}
                                            customCSS={`${roxboroughcfFontCSS} !mb-0 lg:mr-5 mr-0`}
                                            linkHref={`/buyer/dashboard/orders/${userName}`}
                                        />
                                        {
                                            latestOrderData && latestOrderData.length > 0 ? (
                                                latestOrderData.some(items => items.orderStatus === "work in progress") ? (
                                                    latestOrderData.map((items) => {
                                                        if (items.orderStatus === "work in progress") {
                                                            return (
                                                                <div key={items._id}>
                                                                    <LatestOrderViewBoxComponent
                                                                        itemsList={items}
                                                                        barColor={"509652"} />
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                ) : (
                                                    <div className="no-orders my-4">no orders</div>
                                                )
                                            ) : (
                                                <div className="no-orders my-4">no orders</div>
                                            )
                                        }
                                    </section>

                                    <section className="deals-done-section">
                                        <HeadingComponent1
                                            title={"done deals"}
                                            lineWidth={"w-[120%]"}
                                            showRightSide={true}
                                            customCSS={`${roxboroughcfFontCSS} !mb-0 lg:mr-5 mr-0`}
                                            linkHref={`/buyer/dashboard/orders/${userName}`}
                                        />
                                        {
                                            latestOrderData && latestOrderData.length > 0 ? (
                                                latestOrderData.some(items => items.orderStatus === "done deals") ? (
                                                    latestOrderData.map((items) => {
                                                        if (items.orderStatus === "done deals") {
                                                            return (
                                                                <div key={items._id}>
                                                                    <LatestOrderViewBoxComponent
                                                                        itemsList={items}
                                                                        barColor={"6D6E72"} />
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                ) : (
                                                    <div className="no-orders my-4">no orders</div>
                                                )
                                            ) : (
                                                <div className="no-orders my-4">no orders</div>
                                            )
                                        }
                                    </section>
                                </section>
                            }
                        </section>
                    </section>
                </section>
            }
        </>
    )
}

export default BuyerDashboard