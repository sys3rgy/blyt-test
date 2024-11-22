/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import InputComonentForSignInUpPage from "@/components/CommonComponents/InputComonentForSignInUpPage";
import { CrossIcon1, ImageUploadIcon1, LoadingGif, PencilIcon2, SignInUpBriefcaseIcon1, VVIPDealsBackupImage1 } from "@/images/ImagesExport";
import { playfairDisplayFont, roxboroughcfFont } from '@/fonts/Fonts';
import ButtonComponent1 from '../CommonComponents/ButtonComponent1';
import axios from 'axios';
import { toast } from 'react-toastify';
import ToastContainerUtil from '@/utils/ToastContainerUtil';
import PopUpComponent from '../PopUpComponents/PopUpComponent';
import { FetchVVIPDeals } from '@/app/vvip-deals/FetchVVIPDeals';

const mainSectionCSS = "bg-white w-full border border-[#9F885E] rounded-lg drop-shadow-lg lg:px-10 px-5 lg:py-8 py-5";

interface VVIPDealsComponentProps {
    merchantData: any;
}

interface ImageItem {
    url: string;
}

const VVIPDealsComponent: React.FC<VVIPDealsComponentProps> = ({ merchantData }) => {

    const [loading, setloading] = useState(false);
    const [discountValue, setdiscountValue] = useState('');
    const [couponCode, setcouponCode] = useState('');
    const [couponDescription, setcouponDescription] = useState('');
    const [stepsToRedeem, setstepsToRedeem] = useState('');

    const [serviceImages, setserviceImages] = useState<ImageItem[]>([]);
    const [serviceImagesFile, setserviceImagesFile] = useState<File[]>([]);

    //! Popup fields
    const [showPopup, setshowPopup] = useState(false);
    const [popUpTime, setpopUpTime] = useState(0);
    const [message, setmessage] = useState('');

    //~ Deal picture upload code
    function handleServiceImageChange(e: React.ChangeEvent<HTMLInputElement>) {

        setloading(true);

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            if (file.size <= 400 * 1024) {
                if (serviceImagesFile.length > 0) {
                    alert("You can only upload one image.");
                    setloading(false);
                    return;
                }

                const newFilesArray = [file];

                const newImageUrl: ImageItem = { url: URL.createObjectURL(file) };

                setserviceImagesFile(newFilesArray);
                setserviceImages([newImageUrl]);
            } else {
                alert("The selected file exceeds 400 KB in size. Please select a smaller file.");
            }
        }

        setloading(false);
    }

    function deleteImage(imageId: string) {
        const updatedImages = serviceImages.filter(image => image.url !== imageId);
        setserviceImages(updatedImages);
        setserviceImagesFile([]);
    }

    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlipClick = () => {
        setIsFlipped(!isFlipped);
    };

    async function addVVIPDeals() {

        if (!discountValue || !couponCode || !couponDescription || !stepsToRedeem || !serviceImagesFile || !serviceImagesFile[0]) {
            toast.warn("Fill all the fields.", {});
            return;
        }

        if (discountValue.length > 20) {
            return toast.warn('Discount Value max characters allowed is 20.')
        }

        if (couponCode.length > 6) {
            return toast.warn('Max Coupon Code length allowed is 6.')
        }

        if (couponDescription.length > 40) {
            return toast.warn('Coupon Description max characters allowed is 40.')
        }

        if (stepsToRedeem.length > 240) {
            return toast.warn('Steps To Redeem max characters allowed is 240.')
        }

        const formData = new FormData();
        formData.append("merchantId", merchantData?._id)
        formData.append("userName", merchantData?.userName)
        formData.append("discountValue", discountValue)
        formData.append("couponCode", couponCode)
        formData.append("couponDescription", couponDescription)
        formData.append("stepsToRedeem", stepsToRedeem)
        formData.append("dealPicture", serviceImagesFile[0] as any)
        formData.append("isVVIPDeals", 'true')
        formData.append('serviceCategory', merchantData.service.serviceCategory)

        setloading(true);

        const response = await axios.put(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 404) {
            window.location.href = '/';
            return;
        } else if (statusCode === 200) {
            setpopUpTime(3);
            setshowPopup(true);
            setmessage(message);
            resetFields();
        } else {
            toast.warn(message);
        }

        setloading(false);

        await FetchVVIPDeals(true, true);
    }

    function resetFields() {
        setdiscountValue('');
        setcouponCode('');
        setcouponDescription('');
        setstepsToRedeem('');
        setserviceImages([]);
        setserviceImagesFile([]);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setpopUpTime(0);
        }, popUpTime * 1000 * 1.5);

        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
    }, [popUpTime]);

    return (
        <div>

            <ToastContainerUtil />

            {loading &&
                <section className={`loading-icon fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center backdrop-blur-sm`}>
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {!loading &&
                <>
                    <section className={`VVIP-deals-info-section flex lg:flex-row flex-col justify-between gap-10`}>
                        <section className="left-side">
                            <section className="mb-10 lg:w-[502px] w-full">
                                <section className={`${mainSectionCSS} mb-10`}>
                                    <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>deals</p>
                                    <section className="input-fields flex flex-col gap-10">
                                        <section className="inputs-1 flex flex-col justify-between gap-10">

                                            <InputComonentForSignInUpPage customSectionCSS={"min-w-[200px]"} title={"discount value"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                                value={discountValue}
                                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setdiscountValue(e.target.value)}
                                                placeholder='Up to 40% off'
                                            />

                                            <InputComonentForSignInUpPage customSectionCSS={"min-w-[180px]"} title={"discount code"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                                value={couponCode}
                                                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setcouponCode(e.target.value)}
                                                placeholder='max 6 digits'
                                            />

                                        </section>

                                        <section className="inputs-3 flex sm:flex-row flex-col justify-between gap-10 relative">
                                            <textarea rows={2} className="border border-black w-full rounded-lg pt-3 pl-8" value={couponDescription} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setcouponDescription(e.target.value)} placeholder='max 40 characters'></textarea>
                                            <p className="title capitalize absolute -top-3 left-5 bg-white px-2 font-bold">coupon description</p>
                                            <p className="pencil-icon absolute top-[15px] left-2"> <PencilIcon2 width={20} height={20} customCSS={''} /> </p>
                                        </section>

                                        <section className="inputs-3 flex sm:flex-row flex-col justify-between gap-10 relative">
                                            <textarea rows={2} className="border border-black w-full rounded-lg pt-3 pl-8" value={stepsToRedeem} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setstepsToRedeem(e.target.value)} placeholder='max 200 characters'></textarea>
                                            <p className="title capitalize absolute -top-3 left-5 bg-white px-2 font-bold">steps to redeem</p>
                                            <p className="pencil-icon absolute top-[15px] left-2"> <PencilIcon2 width={20} height={20} customCSS={''} /> </p>
                                        </section>
                                    </section>
                                </section>

                                <section className={`${mainSectionCSS}`}>
                                    <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>deal picture</p>
                                    <section className="input-fields flex flex-col gap-10">

                                        <section className="deal-picture-section mb-10">
                                            <section>

                                                <div className="flex justify-between gap-5">
                                                    {serviceImages.length < 1 &&
                                                        <section className="input-fields flex flex-col gap-10 w-fit cursor-pointer">
                                                            <label className='cursor-pointer'>
                                                                <ImageUploadIcon1 width={105} height={100} customCSS={"min-w-[105px]"} />
                                                                <input type="file" className='hidden' accept=".jpg, .jpeg" onChange={handleServiceImageChange} multiple />
                                                            </label>
                                                        </section>
                                                    }
                                                    <div className="image-preview-container flex justify-between gap-5">
                                                        {serviceImages[0]?.url &&
                                                            <div className='relative flex justify-center'>
                                                                <img
                                                                    className="w-48 h-auto object-cover"
                                                                    src={serviceImages[0]?.url || ""}
                                                                />
                                                                <div className='absolute top-3 right-2 flex items-center'>
                                                                    <button onClick={() => deleteImage(serviceImages[0]?.url)}>
                                                                        <CrossIcon1 width={20} height={20} customCSS={'invert'} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>

                                                <p className="normal-case text-xs text-gray-500 mt-4">*Upload a description image so that people can understand your package better</p>
                                            </section>
                                        </section>

                                    </section>
                                </section>
                            </section>
                        </section>

                        <section className={`right-side h-[440px] flip-container ${isFlipped ? 'flip' : ''} relative bg-transparent w-full rounded-lg drop-shadow-lg lg:px-10 teeny:px-5 px-0 lg:py-8 py-5`}>
                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>preview</p>

                            <div className="flipper absolute lg:h-full w-[368px] h-auto m-auto">
                                <section className={`w-full transition-all duration-500 ease-in-out preview-section front`}>
                                    <div className={`image-section-for-vvip-deals-info relative`}>
                                        {!serviceImages[0]?.url ? (
                                            <VVIPDealsBackupImage1 width={400} height={124} customCSS={'max-w-[368px]'} />
                                        ) : (
                                            <img
                                                className="w-full h-[124px] rounded-lg"
                                                src={serviceImages[0]?.url || ''}
                                            />
                                        )}
                                        <div onClick={handleFlipClick} className="absolute top-2 right-2">
                                            <ButtonComponent1 middleSide={'get code'} customSectionCSS={"cursor-pointer"} />
                                        </div>
                                    </div>

                                    <div className="text-section-for-vvip-deals-info bg-white drop-shadow-lg rounded-lg p-6">
                                        <p className={`${playfairDisplayFont.className} font-semibold text-[#B35E5E] text-base capitalize`}>{discountValue || 'up to XX% off'}</p>
                                        <p className='my-2 break-words'>{couponDescription || "Coupon Description"}</p>
                                        <p> <span className='capitalize font-bold break-words'>company name:</span> {merchantData?.businessName}</p>
                                    </div>
                                </section>

                                <section className={`preview-section back bg-white rounded-lg drop-shadow-lg`} onClick={(e) => e.stopPropagation()}>
                                    <div className={`image-section-for-vvip-deals-info relative w-[368px] px-8 py-4 h-[260px]`}>
                                        <p className='font-bold text-2xl'>Steps to redeem:</p>
                                        <p className='mt-4 break-words'>
                                            {stepsToRedeem || "kindly add steps to redeem the code."}
                                        </p>
                                    </div>
                                    <div onClick={handleFlipClick} className="absolute top-2 right-2">
                                        <ButtonComponent1 middleSide={'hide'} customSectionCSS={"cursor-pointer"} />
                                    </div>
                                </section>
                            </div>
                        </section>
                    </section>



                    <button onClick={() => { addVVIPDeals(); }} className="mt-10 flex m-auto w-fit">
                        <ButtonComponent1 middleSide={"add deal"} customButtonCSS={"!px-20 !py-5 text-xl !font-bold"} />
                    </button>
                </>
            }

            {!loading &&
                <section className={`${popUpTime === 0 ? "hidden" : "block"} pop-up-component fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm`}>
                    <PopUpComponent message={message} start={showPopup} time={popUpTime} />
                </section>
            }

        </div>
    )
}

export default VVIPDealsComponent