import { CopyIcon1, DefaultProfilePic1, EditIcon1, EditIcon2, EyeIcon1, FacebookIcon1, HandshakeIcon1, InstagramIcon1, LikesIcon1, LinkedinIcon1, PlusIconInCircle2, StarIcon1, TwitterIcon1, VerifiedIcon1 } from '@/images/ImagesExport';
import Link from 'next/link';
import ButtonComponent1 from '../CommonComponents/ButtonComponent1';
import { poppinsFont, roxboroughcfFont, truenoRegular } from '@/fonts/Fonts';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import ToastContainerUtil from '@/utils/ToastContainerUtil';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import PopUpComponent from '../PopUpComponents/PopUpComponent';

interface MerchantLeftSideBoxComponentProps {
    copyText: () => void;
    showEditProfilePicIcon: boolean;
    editProfilePic?: () => void;
    enableInitiateContactScene?: () => void;
    merchantData: any;
    userName: string;
    userProfilePic: any
    showEditAddOptions?: boolean
    refreshData?: () => void;
}

const MerchantLeftSideBoxComponent: React.FC<MerchantLeftSideBoxComponentProps> = ({ copyText, showEditProfilePicIcon, editProfilePic, enableInitiateContactScene, merchantData, userName, userProfilePic, showEditAddOptions, refreshData }) => {

    //! Popup fields
    const [showPopup, setshowPopup] = useState(false);
    const [popUpTime, setpopUpTime] = useState(0);
    const [message, setmessage] = useState('');
    const [loading, setloading] = useState(false);

    const userNameCookie = getCookie('userName')

    function checkEmptyFields() {
        const { userProfilePic, bio, businessAddress, businessCity, businessLocation, businessName, businessPincode, businessState, phoneNumber, phoneNumberCountryCode, userEmail, userFullName, userName, websiteLink, service: { serviceCategory, serviceCurrency, serviceDeck, serviceDescription, serviceImages, serviceMaxPrice, serviceMinPrice, serviceName, serviceVideo, serviceBanner } } = merchantData || {};

        let emptyField = '';

        if (!bio) {
            emptyField = 'Bio';
        } else if (!serviceBanner) {
            emptyField = 'Banner';
        } else if (!userProfilePic) {
            emptyField = 'Profile Picture';
        } else if (!businessAddress) {
            emptyField = 'Business Address';
        } else if (!businessCity) {
            emptyField = 'Business City';
        } else if (!businessLocation) {
            emptyField = 'Business Location';
        } else if (!businessName) {
            emptyField = 'Business Name';
        } else if (!businessPincode) {
            emptyField = 'Business Pincode';
        } else if (!businessState) {
            emptyField = 'Business State';
        } else if (!phoneNumber) {
            emptyField = 'Phone Number';
        } else if (!phoneNumberCountryCode) {
            emptyField = 'Phone Number Country Code';
        } else if (!userEmail) {
            emptyField = 'User Email';
        } else if (!userFullName) {
            emptyField = 'User Full Name';
        } else if (!userName) {
            emptyField = 'User Name';
        } else if (!websiteLink) {
            emptyField = 'Website Link';
        } else if (!serviceCategory) {
            emptyField = 'Service Category';
        } else if (!serviceCurrency) {
            emptyField = 'Service Currency';
        } else if (!serviceDeck) {
            emptyField = 'Service Deck';
        } else if (!serviceDescription) {
            emptyField = 'Service Description';
        } else if (!serviceImages) {
            emptyField = 'Service Images';
        } else if (!serviceMaxPrice) {
            emptyField = 'Service Max Price';
        } else if (!serviceMinPrice) {
            emptyField = 'Service Min Price';
        } else if (!serviceName) {
            emptyField = 'Service Name';
        } else if (!serviceVideo) {
            emptyField = 'Service Video';
        }

        if (emptyField) {
            alert(`The field "${emptyField}" is empty.`);
            return true;
        }
    }

    async function verifyMe() {

        const isEmpty = checkEmptyFields();
        if (isEmpty) return;

        setloading(true)

        const data = { userName: userNameCookie }
        const response = await axios.post('/api/merchantsAPIs/verifyMeAPI', data);

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            window.location.href = "/";
        } else if (statusCode === 200) {
            toast.success(message, {});
            setpopUpTime(3);
            setshowPopup(true);
            setmessage(message);
            setloading(false)

            if (refreshData) {
                refreshData();
            }

        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setpopUpTime(0);
        }, popUpTime * 1000 * 1.5);

        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
    }, [popUpTime]);


    return (
        <>
            <section className="top-section bg-white teeny:w-96 w-80 rounded-lg drop-shadow-lg p-4 flex flex-col gap-3 md:-mt-20 -mt-10 lg:mx-0 mx-auto">
                <div className="merchant-profile-box flex justify-center">
                    {/* Existing profile box content */}
                    <div className='relative'>
                        {showEditProfilePicIcon &&
                            <div onClick={editProfilePic} className="edit-profile-pic-icon absolute top-0 right-3 cursor-pointer bg-white">
                                <EditIcon2 width={20} height={20} customCSS={''} />
                            </div>
                        }
                        {(merchantData?.userProfilePic || userProfilePic) ?
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={userProfilePic || merchantData?.userProfilePic as string} alt="Profile" className="rounded-full" width={120} height={120} />
                            :
                            <DefaultProfilePic1 width={120} height={120} customCSS={'rounded-full'} />
                        }
                    </div>
                </div>

                <p className={`${roxboroughcfFont.className} font-bold merchant-name text-center text-xl`}>
                    {merchantData?.userFullName}
                </p>

                <p className="merchant-category text-center">
                    {!merchantData?.service.serviceCategory ? <Link href={`/merchant/dashboard/profile/${userName}`}>set category</Link> : merchantData?.service.serviceCategory}
                </p>

                <p className="merchant-ratings flex items-center justify-center gap-1">
                    {Math.round(merchantData?.averageRatings * 10) / 10}<StarIcon1 width={20} height={20} customCSS={'-mt-1'} />({merchantData?.totalReviewsCount} reviews)
                </p>

                <p className='invite-by capitalize my-4 text-center'>
                    invited by: <span className='normal-case font-bold'>{merchantData?.invitedBy}</span>
                </p>

                <div className="website-link bg-[url('/images/MerchantDashboardImages/merchant-box-design-1.png')] bg-cover px-4 pt-2">
                    <section className="top-section">
                        <span className='font-medium capitalize text-sm'>website link</span>
                    </section>
                    <section className="bottom-section flex items-center gap-5">
                        <div className='link text-[#9F885E] overflow-hidden text-ellipsis whitespace-nowrap'>{merchantData?.websiteLink}</div>
                        <span onClick={copyText} className='cursor-pointer'><CopyIcon1 width={30} height={30} customCSS={'min-w-[20px]'} /></span>
                    </section>
                </div>

                {(!merchantData?.socialMediaLinks?.instagram && !merchantData?.socialMediaLinks?.twitter && !merchantData?.socialMediaLinks?.facebook && !merchantData?.socialMediaLinks?.linkedin) ?
                    <>
                        <div className='hidden'></div>
                    </>
                    :
                    <>
                        <div className="social-media-links bg-[url('/images/MerchantDashboardImages/merchant-box-design-1.png')] bg-cover px-4 pt-2 mt-4">
                            <section className="top-section">
                                <span className='font-medium capitalize text-sm'>social media</span>
                            </section>
                            <section className="bottom-section flex items-center gap-5">
                                {merchantData?.socialMediaLinks?.instagram &&
                                    <Link className='instagram-link' href={`https://www.instagram.com/${merchantData?.socialMediaLinks?.instagram}`} target="_blank" rel="noopener noreferrer">
                                        <InstagramIcon1 width={32} height={32} customCSS={''} />
                                    </Link>
                                }

                                {merchantData?.socialMediaLinks?.twitter &&
                                    <Link className='twitter-link' href={`https://twitter.com/${merchantData?.socialMediaLinks?.twitter}`} target="_blank" rel="noopener noreferrer">
                                        <TwitterIcon1 width={32} height={32} customCSS={''} />
                                    </Link>
                                }

                                {merchantData?.socialMediaLinks?.linkedin &&
                                    <Link className='linkedin-link' href={`https://www.linkedin.com/in/${merchantData?.socialMediaLinks?.linkedin}`} target="_blank" rel="noopener noreferrer">
                                        <LinkedinIcon1 width={32} height={32} customCSS={''} />
                                    </Link>
                                }

                                {merchantData?.socialMediaLinks?.facebook &&
                                    <Link className='facebook-link' href={`https://www.facebook.com/${merchantData?.socialMediaLinks?.facebook}`} target="_blank" rel="noopener noreferrer">
                                        <FacebookIcon1 width={32} height={32} customCSS={''} />
                                    </Link>
                                }
                            </section>
                        </div>
                    </>
                }

                <div className="activation-status bg-[url('/images/MerchantDashboardImages/merchant-box-design-1.png')] bg-cover px-4 pt-2 mt-4">
                    <section className="top-section">
                        <span className='font-medium capitalize text-sm'>activation status</span>
                    </section>
                    <section className="bottom-section flex items-center justify-between">
                        <span className='link text-[#9F885E] font-bold capitalize'>
                            {merchantData?.activationStatus ? "verified" : "unverified"}
                        </span>
                        <span className='cursor-pointer -mt-[6px]'>
                            {merchantData?.activationStatus &&
                                <VerifiedIcon1 width={30} height={30} customCSS={''} />
                            }
                        </span>
                    </section>
                </div>

                <section className="deals-and-profile-views-section flex justify-between mt-4 gap-2">
                    <div className="deals-count bg-[url('/images/MerchantDashboardImages/merchant-box-design-1.png')] bg-[length:100%_100%] w-2/5 px-4 pt-2">
                        <section className="top-section">
                            <span className='font-medium capitalize text-xs'>deals</span>
                        </section>
                        <section className="bottom-section flex items-center">
                            <span className='link text-[#9F885E] flex items-center gap-2 font-bold'>
                                <HandshakeIcon1 width={20} height={20} customCSS={''} /> {merchantData?.dealsCount}
                            </span>
                        </section>
                    </div>

                    <div className="profile-views bg-[url('/images/MerchantDashboardImages/merchant-box-design-1.png')] bg-[length:100%_100%] w-2/5 px-4 pt-2 font-bold">
                        <section className="top-section">
                            <span className='font-medium capitalize text-xs'>profile views</span>
                        </section>
                        <section className="bottom-section flex items-center">
                            <span className='link text-[#9F885E] flex items-center gap-2'>
                                <EyeIcon1 width={20} height={20} customCSS={''} /> {merchantData?.profileViews}
                            </span>
                        </section>
                    </div>

                    <div className="profile-likes bg-[url('/images/MerchantDashboardImages/merchant-box-design-1.png')] bg-[length:100%_100%] w-2/5 px-4 pt-2 font-bold">
                        <section className="top-section">
                            <span className='font-medium capitalize text-xs'>likes</span>
                        </section>
                        <section className="bottom-section flex items-center">
                            <span className='link text-[#9F885E] flex items-center gap-2'>
                                <LikesIcon1 width={20} height={20} customCSS={'invert'} /> {merchantData?.likes}
                            </span>
                        </section>
                    </div>
                </section>

                {(!showEditAddOptions && merchantData?.activationStatus && !merchantData?.banned) &&
                    <button onClick={enableInitiateContactScene} className='w-fit flex m-auto'>
                        <ButtonComponent1
                            middleSide="initiate contact"
                            customButtonCSS="uppercase bg-[#9F885E] text-white w-fit m-auto px-6 py-2 rounded-lg drop-shadow-lg flex gap-4" />
                    </button>
                }

                {showEditAddOptions &&
                    <Link href={`/merchant/dashboard/profile/${userName}`} className='w-fit flex m-auto'>
                        <ButtonComponent1
                            middleSide=" edit profile"
                            rightSide={<EditIcon1 width={20} height={20} customCSS={''} />}
                            customButtonCSS={`${truenoRegular.className} uppercase bg-[#9F885E] text-white w-fit m-auto px-6 py-2 rounded-lg drop-shadow-lg flex gap-4`} />
                    </Link>
                }
            </section>
            {showEditAddOptions &&
                <>
                    {(!merchantData?.service.serviceCategory) &&
                        <Link href={`/merchant/dashboard/profile/${userName}`} className='bottom-section w-fit flex m-auto mt-4'>
                            <ButtonComponent1
                                middleSide="add service"
                                rightSide={<PlusIconInCircle2 width={20} height={20} customCSS={''} />}
                                customButtonCSS={`${poppinsFont.className} font-extrabold uppercase flex m-auto text-white !font-bold gap-4 rounded-lg drop-shadow-lg items-center bg-[#6D6E72] !px-10 !py-5 !w-fit`} />
                        </Link>
                    }

                    {(merchantData?.service.serviceCategory && merchantData?.activationStatus) &&
                        <Link href={`/merchant/dashboard/${userName}/add-a-package`} className='bottom-section w-fit flex m-auto mt-4'>
                            <ButtonComponent1
                                middleSide="add a package"
                                rightSide={<PlusIconInCircle2 width={20} height={20} customCSS={''} />}
                                customButtonCSS={`${poppinsFont.className} font-extrabold uppercase flex m-auto text-white font-bold gap-4 rounded-lg drop-shadow-lg items-center bg-[#6D6E72] px-14 py-5 w-fit`} />
                        </Link>
                    }

                    {(merchantData?.service.serviceCategory && !merchantData?.activationStatus && !merchantData?.toVerify) &&
                        <div onClick={verifyMe} className='bottom-section w-fit flex m-auto mt-4 cursor-pointer'>
                            <ButtonComponent1
                                middleSide="verify me"
                                customButtonCSS={`${poppinsFont.className} font-extrabold uppercase flex m-auto text-white font-bold gap-4 rounded-lg drop-shadow-lg items-center bg-[#6D6E72] !px-20 !py-5 w-fit hover:bg-green-500 transition-all ease-in-out duration-500`} />
                        </div>
                    }

                    {merchantData?.toVerify && !merchantData?.activationStatus &&
                        <div className='bottom-section w-fit flex m-auto mt-4'>
                            <ButtonComponent1
                                middleSide="in process"
                                customButtonCSS={`${poppinsFont.className} font-extrabold uppercase flex m-auto text-white font-bold gap-4 rounded-lg drop-shadow-lg items-center bg-[#ff0000] !px-20 !py-5 w-fit`} />
                        </div>
                    }
                </>
            }

            {
                <ToastContainerUtil />
            }

            {!loading &&
                <section className={`z-50 ${popUpTime === 0 ? "hidden" : "block"} pop-up-component fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm`}>
                    <PopUpComponent message={message} start={showPopup} time={popUpTime} />
                </section>
            }
        </>
    )
}

export default MerchantLeftSideBoxComponent;