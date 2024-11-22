/* eslint-disable @next/next/no-img-element */
'use client'

import ButtonComponent1 from "@/components/CommonComponents/ButtonComponent1";
import InputComonentForSignInUpPage from "@/components/CommonComponents/InputComonentForSignInUpPage";
import { ArrowIcon2, CrossIcon1, FacebookIcon1, ImageUploadIcon1, InstagramIcon1, LinkedinIcon1, LoadingGif, LocationIcon1, LocationIcon2, PDFIcon1, PDFUploadIcon1, PencilIcon1, PencilIcon2, SignInUpBriefcaseIcon1, SignInUpEmailSignIcon1, SignInUpPhoneIcon1, SignInUpUserIcon1, TwitterIcon1, VerificationImage1, VideoUploadIcon1, WebsiteUrlIcon1 } from "@/images/ImagesExport";
import { CountriesList, CountryPhoneCodes, CurrencyList, MerchantData, ServiceCategoriesList } from "@/interfaces/MerchantDashboardInterface";
import axios from "axios";
import Link from "next/link";
import { SetStateAction, use, useCallback, useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { toast } from 'react-toastify';

//! Fetching JSON Data
import CurrencyListJSON from '@/constants/CurrencyList.json';
import CountriesListJSON from '@/constants/CountriesList.json'
import CountryPhoneCodesList from '@/constants/CountryPhoneCodesList.json'

import PopUpComponent from "@/components/PopUpComponents/PopUpComponent";
import FundingInformationComponent from "@/components/MerchantComponents/FundingInformationComponent";
import { roxboroughcfFont } from "@/fonts/Fonts";
import VVIPDealsComponent from "@/components/MerchantComponents/VVIPDealsComponent";
import { deleteCookie, getCookie } from "cookies-next";

interface Params {
    slug: string;
    userName: string;
}

interface ImageItem {
    url: string;
    id: string;
    order: number;
}

interface ServiceImageFile extends File {
    id: string;
    order: number;
}

const mainSectionCSS = "bg-white w-full border border-[#9F885E] rounded-lg drop-shadow-lg lg:px-20 px-5 lg:py-10 py-5";

const MerchantProfilePage: React.FC<{ params: Params }> = ({ params }) => {

    const token = getCookie('token');
    const sessionId = getCookie('sessionId');
    const agent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    //* Getting userName from URL
    const { userName } = params;
    const key = userName + "-profile-data";
    const now = new Date();

    //* Personal Info Section

    //^ Input fields states for Personal Info
    const [fullName, setfullName] = useState('');

    const [businessName, setbusinessName] = useState('');
    const [newBusinessName, setnewBusinessName] = useState('');
    const [newWebsiteLink, setnewWebsiteLink] = useState('');

    const [location, setlocation] = useState('');
    const [bio, setbio] = useState('');

    const [instagramLink, setinstagramLink] = useState('');
    const [twitterLink, settwitterLink] = useState('');
    const [linkedinLink, setlinkedinLink] = useState('');
    const [facebookLink, setfacebookLink] = useState('');

    const [phoneNumberCountryCode, setphoneNumberCountryCode] = useState('')
    const [phoneNumber, setphoneNumber] = useState('');
    const [address, setaddress] = useState('');
    const [city, setcity] = useState('');
    const [state, setstate] = useState('');
    const [pincode, setpincode] = useState('');

    //^ Input fields states for Service Info
    const [serviceCategory, setserviceCategory] = useState('');
    const [serviceName, setserviceName] = useState('');
    const [serviceDescription, setserviceDescription] = useState('');

    const [currency, setcurrency] = useState('');

    const [minPrice, setminPrice] = useState<number | null>(0);
    const [maxPrice, setmaxPrice] = useState<number | null>(0);

    const [serviceImages, setserviceImages] = useState<ImageItem[]>([]);
    const [serviceImagesFile, setserviceImagesFile] = useState<ServiceImageFile[]>([]);

    const [serviceVideo, setserviceVideo] = useState<File | string | null>(null);
    const [serviceVideoFile, setserviceVideoFile] = useState<File | null>(null);

    const [serviceDeck, setserviceDeck] = useState<File | string | null>(null);
    const [serviceDeckFile, setserviceDeckFile] = useState<File | null>(null);

    //! Fetch Merchant Data & List as per requirements
    const [merchantData, setmerchantData] = useState<MerchantData | null>(null);
    const [isVerified, setisVerified] = useState(true)

    const [loading, setloading] = useState(true);

    //! Popup fields
    const [showPopup, setshowPopup] = useState(false);
    const [popUpTime, setpopUpTime] = useState(0);
    const [message, setmessage] = useState('');

    const fetchMerchantPrivateData = useCallback(async () => {

        setloading(true);

        emptyUseStatesValues();

        const response = await axios.get(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName=${userName}`);

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

        const data = response.data.merchantData;

        setmerchantData(response.data.merchantData);
        setinstagramLink(data.socialMediaLinks?.instagram || "");
        settwitterLink(data.socialMediaLinks?.twitter || "");
        setlinkedinLink(data.socialMediaLinks?.linkedin || "");
        setfacebookLink(data.socialMediaLinks?.facebook || "");

        basicDataSetState(data);

        setloading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName]);

    useEffect(() => {
        fetchMerchantPrivateData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //! Setting tab css & showing the tab data on click
    const [activeTab, setActiveTab] = useState('personal info');
    const showTab = (tabName: string) => {
        setActiveTab(tabName);
    }

    //! Updating Personal Info
    async function updatePersonalInformation() {

        setloading(true);

        const formData = new FormData();
        formData.append("fullName", fullName);

        formData.append("businessName", businessName);
        formData.append("newBusinessName", newBusinessName);

        formData.append("location", location);
        formData.append("bio", bio);


        formData.append('instagramLink', instagramLink)
        formData.append('twitterLink', twitterLink)
        formData.append('linkedinLink', linkedinLink)
        formData.append('facebookLink', facebookLink)

        formData.append("phoneNumberCountryCode", phoneNumberCountryCode);
        formData.append("phoneNumber", phoneNumber);
        formData.append("address", address);
        formData.append("city", city);
        formData.append("state", state);
        formData.append("pincode", pincode);
        formData.append("isPersonalInformation", 'true');
        formData.append("userName", userName);

        const response = await axios.put(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const message = response.data.message;
        const statusCode = response.data.statusCode;

        if (statusCode === 409) {
            toast.error(message, {});
            setloading(false)
            return;
        }

        toast.success(message, {});

        setpopUpTime(3);
        setshowPopup(true);
        setmessage(message);

        localStorage.removeItem(userName + '-homepage-data');

        await fetchMerchantPrivateData();
    }

    //* Service Info Section
    //! Updating Service Info
    async function updateServiceInformation() {

        setloading(true);

        const formData = new FormData();

        formData.append("serviceCategory", serviceCategory);
        formData.append("serviceName", serviceName);
        formData.append("serviceDescription", serviceDescription);
        formData.append("isServiceInformation", 'true')

        formData.append("userName", userName);
        formData.append("token", token || "");
        formData.append("sessionId", sessionId || "");
        formData.append("agent", agent || "");

        formData.append("currency", currency);
        formData.append("minPrice", `${minPrice}`);
        formData.append("maxPrice", `${maxPrice}`);

        serviceImages.forEach((image, index) => {
            if (image.url.startsWith(`https://s3.${process.env.NEXT_PUBLIC_REGION}.amazonaws.com`)) {
                formData.append("serviceImages", image.url);
            } else if (image.url.startsWith('blob:')) {
                const file = serviceImagesFile.find(file => file.id === image.id);
                if (file) {
                    formData.append("serviceImages", file, file.name);
                }
            }
        });

        // //~ Service Video File
        if (serviceVideoFile) {
            formData.append("serviceVideo", serviceVideoFile as File, serviceVideoFile?.name as string);
        } else {
            formData.append("serviceVideo", serviceVideo as File);
        }

        //~ Service PDF File
        if (serviceDeckFile) {
            formData.append("serviceDeck", serviceDeckFile as File, serviceDeckFile?.name as string);
        } else {
            formData.append("serviceDeck", serviceDeck as string);
        }

        const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_DOMAIN_NAME}/merchantAccountDataFetchUpdateAPI?userName=${userName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response.data)
        const message = response.data.message;
        const statusCode = response.data.statusCode;

        setpopUpTime(3);
        setshowPopup(true);

        if (statusCode === 404) {

            setmessage('No Session Found');

            deleteCookie("userName");
            deleteCookie("token");
            deleteCookie("sessionId");
            deleteCookie("isLogin");

            setTimeout(() => {
                window.location.href = '/';
            }, 3000);

            return;
        }

        setmessage('Service Information updated successfully');

        await fetchMerchantPrivateData();

        setActiveTab('service info');
    }

    //~ Service Image upload code
    function handleServiceImageChange(e: React.ChangeEvent<HTMLInputElement>) {

        setloading(true);

        if (e.target.files) {
            const exceededSizeFiles: File[] = [];
            const newFilesArray: ServiceImageFile[] = [];

            Array.from(e.target.files).forEach((file, index) => {
                const id = generateUniqueId();
                const order = serviceImagesFile.length + index;

                if (file.size <= 400 * 1024) {
                    newFilesArray.push(Object.assign(file, { id, order }));
                } else {
                    exceededSizeFiles.push(file); // Store the files that exceed 400 KB
                }
            });

            if (exceededSizeFiles.length > 0) {
                alert("The following files exceed 400 KB in size and were not added: " + exceededSizeFiles.map(file => file.name).join(', '));
                setloading(false);
                return;
            }

            const totalFilesArray = [...serviceImagesFile, ...newFilesArray];

            if (totalFilesArray.length > 5 || serviceImages.length > 5) {
                alert("You can only upload a maximum of 5 images in total.");
                setloading(false);
                return;
            }

            const newImagesUrls: ImageItem[] = newFilesArray.map(file => ({ url: URL.createObjectURL(file), id: file.id, order: file.order }));
            const totalImagesUrls = [...serviceImages, ...newImagesUrls];

            setserviceImagesFile(totalFilesArray);
            setserviceImages(totalImagesUrls);
        }

        setloading(false);
    }

    function deleteImage(imageId: string) {
        const updatedImages = serviceImages.filter(image => image.id !== imageId);
        setserviceImages(updatedImages);

        const updatedFiles = serviceImagesFile.filter(file => file.id !== imageId);
        setserviceImagesFile(updatedFiles);
    }

    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9);
    }

    //~ Service Video Upload Code
    function handleServiceVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {

            const videoSizeCheck = ((e.target.files[0].size / 1024) / 1024).toFixed(2);
            if (parseInt(videoSizeCheck) > 10) {
                alert("Video file size exceed limit of 10MB.")
                return;
            }

            const file = e.target.files[0];
            const videoUrl = URL.createObjectURL(file);
            setserviceVideoFile(file); // Storing The File
            setserviceVideo(videoUrl); // Converting file to link to show in browser
        }
    }

    //~ Service Deck Upload Code
    const [pdfFileName, setpdfFileName] = useState('');
    function handleServiceDeckChange(e: React.ChangeEvent<HTMLInputElement>) {

        if (e.target.files && e.target.files[0]) {

            if (e.target.files[0].size >= 1024 * 1024) {
                alert("Maximum file size is 1MB.")
                return;
            }

            const file = e.target.files[0];
            const pdfUrl = URL.createObjectURL(file);
            setpdfFileName(file.name);
            setserviceDeckFile(file); // Storing The File
            setserviceDeck(pdfUrl); // Converting file to link to show in browser
        }
    }

    function emptyUseStatesValues() {
        setfullName('');
        setbusinessName('');
        setnewBusinessName('');
        setlocation('');
        setbio('');
        setphoneNumberCountryCode('');
        setphoneNumber('');
        setaddress('');
        setcity('');
        setstate('');
        setpincode('');
        setserviceCategory('');
        setserviceName('');
        setserviceDescription('');
        setserviceImages([]);
        setserviceImagesFile([]);
        setserviceVideo(null);
        setserviceVideoFile(null);
        setserviceDeck(null);
        setserviceDeckFile(null);
        setmerchantData(null);
        setpdfFileName('');
        setcurrency('');
        setminPrice(null);
        setmaxPrice(null);
    }

    useEffect(() => {
        const url = `https://www.blyt.world/merchant/${userName}/${newBusinessName}`;
        if (newBusinessName) {
            setnewWebsiteLink(url.replace(/\s+/g, '-'));
        } else {
            setnewWebsiteLink(merchantData?.websiteLink || "")
        }
    }, [userName, newBusinessName, merchantData?.websiteLink])

    async function basicDataSetState(data: any) {

        setfullName(data.userFullName || "");
        setbusinessName(data.businessName || "");
        setbio(data.bio || "");
        setphoneNumberCountryCode(data.phoneNumberCountryCode || "");
        setphoneNumber(data.phoneNumber || "");
        setaddress(data.businessAddress || "");
        setcity(data.businessCity || "");
        setstate(data.businessState || "");
        setpincode(data.businessPincode || "");

        //! If account is activated, then, don't show dropdown, just show location
        if (data.activationStatus && data.businessLocation) {
            setlocation(data.businessLocation || "");
        } else {
            setlocation(data.businessLocation || "");
        }

        if (data.activationStatus && data.service.serviceCategory) {
            setserviceCategory(data.service.serviceCategory || "");
        } else {
            setserviceCategory(data.service.serviceCategory || "");
        }

        setserviceName(data.service.serviceName || "");
        setserviceDescription(data.service.serviceDescription || "");
        setserviceVideo(data.service.serviceVideo || "");
        setserviceDeck(data.service.serviceDeck || "");

        if (data.service.serviceImages) {
            const formattedImages = data.service.serviceImages.map((url: any, index: any) => ({
                url: url,
                id: generateUniqueId(),
                order: index // We assuming initial order is based on the array index
            }));
            setserviceImages(formattedImages);
        } else {
            setserviceImages([]);
        }

        setcurrency(data.service.serviceCurrency || "");
        setminPrice(data.service.serviceMinPrice || 0);
        setmaxPrice(data.service.serviceMaxPrice || 0);
        setisVerified(data.activationStatus || false);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setpopUpTime(0);
        }, popUpTime * 1000 * 1.5);

        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
    }, [popUpTime]);

    //! Call the addFundingData function for FundingInformationComponent to fetch new data
    const handleButtonClick = async (tabName: string) => {
        const response = await axios.get(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName=${userName}`);
        setmerchantData(response.data.merchantData);
        setActiveTab(tabName);
    };

    return (
        <>
            {loading &&
                <section className="loading-icon fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm z-50">
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {(!loading && merchantData?.toVerify && !merchantData.activationStatus) ?
                <>
                    <section className="flex justify-center pb-4">
                        <VerificationImage1 width={1000} height={1000} customCSS={"sm:w-96 w-80 h-auto"} />
                    </section>
                </>
                :
                <>
                    <section className={`${popUpTime === 0 ? "block" : "blur-sm pointer-events-none"} profile-view-section`}>
                        <section className="back-button mt-10">
                            <section className="max-width max-w-screen-xl m-auto px-4">
                                <section className="back-to-profile-button mb-10">
                                    <Link className="flex items-center uppercase gap-2 font-bold border-2 border-black rounded-lg drop-shadow-lg px-4 py-2 w-fit" href={`/merchant/dashboard/${userName}`}>
                                        <ArrowIcon2 width={25} height={0} customCSS={""} />
                                        back to profile
                                    </Link>
                                </section>
                            </section>
                        </section>

                        <section className="personal-service-and-funding-information-section max-w-5xl m-auto px-4 pb-10">
                            {/* Profile Page Navbar */}
                            <section className={`${roxboroughcfFont.className} font-bold profile-page-nav-bar flex justify-between lg:text-2xl sm:text-xl text-base text-center capitalize mb-10 gap-3`}>
                                <p onClick={() => showTab('personal info')}
                                    className={`${activeTab === 'personal info' ? "underline underline-offset-8 decoration-[#9F885E] cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>
                                    personal info
                                </p>
                                <p onClick={() => { showTab('service info'); }}
                                    className={`${activeTab === 'service info' ? "underline underline-offset-8 decoration-[#9F885E] cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>
                                    service info
                                </p>
                                {merchantData?.activationStatus && <p onClick={() => showTab('funding info')}
                                    className={`${activeTab === 'funding info' ? "underline underline-offset-8 decoration-[#9F885E] cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>
                                    funding info
                                </p>
                                }
                                {merchantData?.activationStatus &&
                                    <p onClick={() => showTab('VVIP deals info')}
                                        className={`${activeTab === 'VVIP deals info' ? "underline underline-offset-8 decoration-[#9F885E] cursor-pointer" : "text-[#4D4D4D] cursor-pointer"}`}>
                                        VVIP deals info
                                    </p>
                                }
                            </section>

                            {/* Personal Info Section */}
                            {activeTab === 'personal info' &&
                                <section className="personal-info-section">

                                    {/* Required Details Section */}
                                    <section className="required-details mb-10">
                                        <section className={`${mainSectionCSS}`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>required details <span className="text-red-500">*</span> </p>
                                            <section className="input-fields flex flex-col gap-10">
                                                <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"full name"} customTitleCSS={"bg-white"} image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={fullName} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setfullName(e.target.value)} readonly={isVerified} />
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"business name"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={!newBusinessName ? businessName : newBusinessName} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setnewBusinessName(e.target.value)} readonly={isVerified} />
                                                </section>

                                                {/* Countries List Drop-down */}
                                                <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative">
                                                    <div className="absolute top-1/2 -translate-y-1/2 left-2"><LocationIcon2 width={20} height={20} customCSS={''} /></div>
                                                    <div className="absolute capitalize font-bold bg-white px-2 -top-3 left-5">country</div>
                                                    {!merchantData?.activationStatus ?
                                                        <select className="w-full border border-black rounded-lg pl-8 py-3 bg-transparent default:" value={location} onChange={(e) => setlocation(e.target.value)}>
                                                            <option value="">Select A Country</option>
                                                            {CountriesListJSON.map((item: CountriesList) => (
                                                                <option key={item.country} value={item.country}>
                                                                    {item.country}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        :
                                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"country"} customTitleCSS={"bg-white"} image={undefined} inputType={"name"} value={location} readonly={true} />
                                                    }

                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"company link"} customTitleCSS={"bg-white"} image={<WebsiteUrlIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={!newWebsiteLink ? (merchantData?.websiteLink || '') : newWebsiteLink} readonly={true} />
                                                </section>

                                                <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative">
                                                    <textarea rows={4} className="border border-black w-full rounded-lg pt-3 pl-8" value={bio} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setbio(e.target.value)}></textarea>
                                                    <p className="title capitalize absolute -top-3 left-5 bg-white px-2 font-bold">bio</p>
                                                    <p className="pencil-icon absolute top-[15px] left-2"> <PencilIcon2 width={20} height={20} customCSS={''} /> </p>
                                                </section>

                                                <section className="inputs-1 flex sm:flex-row flex-col justify-between sm:gap-2 gap-10">
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"instagram"} customTitleCSS={"bg-white"}
                                                        image={<InstagramIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                                        value={instagramLink} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setinstagramLink(e.target.value)}
                                                        placeholder="@" />

                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"twitter"} customTitleCSS={"bg-white"}
                                                        image={<TwitterIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                                        value={twitterLink} onChange={(e: { target: { value: SetStateAction<string>; }; }) => settwitterLink(e.target.value)}
                                                        placeholder="@" />

                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"linkedin"} customTitleCSS={"bg-white"}
                                                        image={<LinkedinIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                                        value={linkedinLink} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setlinkedinLink(e.target.value)}
                                                        placeholder="Username" />

                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"facebook"} customTitleCSS={"bg-white"}
                                                        image={<FacebookIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                                        value={facebookLink} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setfacebookLink(e.target.value)}
                                                        placeholder="Username" />
                                                </section>
                                            </section>
                                        </section>
                                    </section>

                                    {/* Contact Information Section */}
                                    <section className="contact-information-section mb-10">
                                        <section className={`${mainSectionCSS}`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>contact information</p>
                                            <section className="input-fields flex flex-col gap-10">
                                                <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">
                                                    <InputComonentForSignInUpPage customSectionCSS={"md:w-2/3 w-full"} title={"email"} customTitleCSS={"bg-white"} image={<SignInUpEmailSignIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={merchantData?.userEmail || ""} readonly={true} />

                                                    {/* Countries List Drop-down */}
                                                    {!merchantData?.activationStatus &&
                                                        <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative">
                                                            <div className="absolute top-1/2 -translate-y-1/2 left-2"><LocationIcon2 width={20} height={20} customCSS={''} /></div>
                                                            <div className="absolute capitalize font-bold bg-white px-2 -top-3 left-5">CC</div>
                                                            <select className="w-full border border-black rounded-lg pl-8 py-3 bg-transparent default:" value={phoneNumberCountryCode} onChange={(e) => setphoneNumberCountryCode(e.target.value)}>
                                                                <option value="">Select A Country</option>
                                                                {CountryPhoneCodesList.map((item: CountryPhoneCodes) => (
                                                                    <option key={item.country} value={item.code}>
                                                                        {item.country} - {item.code}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </section>
                                                    }

                                                    {!merchantData?.activationStatus &&
                                                        <InputComonentForSignInUpPage customSectionCSS={"md:w-1/2 w-full"} title={"phone number"} customTitleCSS={"bg-white"} image={<SignInUpPhoneIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={phoneNumber} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setphoneNumber(e.target.value)} readonly={isVerified} />
                                                    }

                                                    {merchantData?.activationStatus &&
                                                        <InputComonentForSignInUpPage customSectionCSS={"md:w-1/2 w-full"} title={"phone number"} customTitleCSS={"bg-white"} image={<SignInUpPhoneIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={phoneNumberCountryCode + " - " + phoneNumber} onChange={undefined} readonly={isVerified} />
                                                    }
                                                </section>
                                            </section>
                                        </section>
                                    </section>

                                    {/* Address Section */}
                                    <section className="address-information-section">
                                        <section className={`${mainSectionCSS}`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>address</p>
                                            <section className="input-fields flex flex-col gap-10">
                                                <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"address"} customTitleCSS={"bg-white"} image={<LocationIcon2 width={20} height={20} customCSS={''} />} inputType={""} value={address} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setaddress(e.target.value)} readonly={isVerified} />
                                                </section>

                                                <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"city"} customTitleCSS={"bg-white"} image={<LocationIcon2 width={20} height={20} customCSS={''} />} inputType={""} value={city} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setcity(e.target.value)} readonly={isVerified} />
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"state"} customTitleCSS={"bg-white"} image={<LocationIcon2 width={20} height={20} customCSS={''} />} inputType={""} value={state} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setstate(e.target.value)} readonly={isVerified} />
                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"Area code"} customTitleCSS={"bg-white"} image={<LocationIcon2 width={20} height={20} customCSS={''} />} inputType={""} value={pincode} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setpincode(e.target.value)} readonly={isVerified} />
                                                </section>

                                            </section>
                                        </section>
                                    </section>

                                    <button onClick={updatePersonalInformation} className="update-button mt-10 flex m-auto w-fit">
                                        <ButtonComponent1 middleSide={"update"} customButtonCSS={"!px-20 !py-5 text-xl !font-bold"} />
                                    </button>
                                </section>
                            }

                            {activeTab === 'service info' &&
                                <section className="service-info-section">
                                    {/* Services Section */}
                                    <section className="services-section mb-10">
                                        <section className={`${mainSectionCSS}`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>services</p>
                                            <section className="input-fields flex flex-col gap-10">
                                                <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">
                                                    {/* Service Category List Drop-down */}
                                                    <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative w-full">
                                                        <div className="absolute top-1/2 -translate-y-1/2 left-2"><SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} /></div>
                                                        <div className="absolute capitalize font-bold bg-white px-2 -top-3 left-5">service category</div>
                                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"service category"} customTitleCSS={"bg-white"} image={undefined} inputType={"name"} value={serviceCategory} readonly={true} />
                                                    </section>

                                                    <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"service name"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={""} value={serviceName} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setserviceName(e.target.value)} />
                                                </section>
                                                <section className="inputs-3 flex sm:flex-row flex-col justify-between gap-10 relative">
                                                    <textarea rows={4} className="border border-black w-full rounded-lg pt-3 pl-8" value={serviceDescription} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setserviceDescription(e.target.value)}></textarea>
                                                    <p className="title capitalize absolute -top-3 left-5 bg-white px-2 font-bold">service description</p>
                                                    <p className="pencil-icon absolute top-[15px] left-2"> <PencilIcon2 width={20} height={20} customCSS={''} /> </p>
                                                </section>

                                                <div className="price-range flex sm:flex-row flex-col gap-10">
                                                    <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative w-full">
                                                        <div className="absolute top-1/2 -translate-y-1/2 left-2"><SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} /></div>
                                                        <div className="absolute capitalize font-bold bg-white px-2 -top-3 left-5">currency</div>
                                                        {(!merchantData?.activationStatus) ?
                                                            <select className="w-full border border-black rounded-lg pl-8 py-3 bg-transparent default:" value={currency} onChange={(e) => setcurrency(e.target.value)}>
                                                                <option value="">Select Currency</option>
                                                                {CurrencyListJSON.map((item: CurrencyList) => (
                                                                    <option key={item.cc} value={item.cc}>
                                                                        {item.name} - ({item.cc}) - {`${item.symbol}`}
                                                                    </option>
                                                                ))}

                                                            </select>
                                                            :
                                                            <InputComonentForSignInUpPage customSectionCSS={"w-full"} title={"currency"} customTitleCSS={"bg-white"} image={undefined} inputType={"name"} value={currency} readonly={true} />
                                                        }
                                                    </section>

                                                    {/* Show this side by side when Screeb Size >=640px */}
                                                    <InputComonentForSignInUpPage customSectionCSS={"sm:block hidden w-1/2"} title={"min price"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"number"} value={minPrice !== null ? minPrice.toString() : ''} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setminPrice(e.target.value ? Number(e.target.value) : null)} />
                                                    <InputComonentForSignInUpPage customSectionCSS={"sm:block hidden w-1/2"} title={"max price"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"number"} value={maxPrice !== null ? maxPrice.toString() : ''} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setmaxPrice(e.target.value ? Number(e.target.value) : null)} />

                                                    {/* Else show this */}
                                                    <section className="mobile-min-and-max-price-section sm:hidden flex gap-5">
                                                        <InputComonentForSignInUpPage customSectionCSS={"w-1/2"} title={"min price"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"number"} value={minPrice !== null ? minPrice.toString() : ''} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setminPrice(e.target.value ? Number(e.target.value) : null)} />
                                                        <InputComonentForSignInUpPage customSectionCSS={"w-1/2"} title={"max price"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"number"} value={maxPrice !== null ? maxPrice.toString() : ''} onChange={(e: { target: { value: SetStateAction<string>; }; }) => setmaxPrice(e.target.value ? Number(e.target.value) : null)} />
                                                    </section>
                                                </div>
                                            </section>
                                        </section>
                                    </section>

                                    {/* Gallery Section */}
                                    <section className="gallery-section mb-10">
                                        <section className={`${mainSectionCSS}`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>gallery (add upto 5)</p>

                                            <div className="flex justify-between gap-5">
                                                {serviceImages.length < 5 &&
                                                    <section className="input-fields flex flex-col gap-10 w-fit cursor-pointer">
                                                        <label className='cursor-pointer'>
                                                            <ImageUploadIcon1 width={105} height={100} customCSS={"min-w-[105px]"} />
                                                            <input type="file" className='hidden' accept=".jpg, .jpeg" onChange={handleServiceImageChange} multiple />
                                                        </label>
                                                    </section>
                                                }
                                                <div className="image-preview-container flex justify-between gap-5">
                                                    <ReactSortable
                                                        list={serviceImages}
                                                        setList={(newList) => {
                                                            setserviceImages(newList as ImageItem[]);
                                                            const updatedFiles = serviceImagesFile.map((file) => {
                                                                const newIndex = newList.findIndex((item) => item.id === file.id);
                                                                file.order = newIndex;
                                                                return file;
                                                            });
                                                            setserviceImagesFile(updatedFiles);
                                                        }}
                                                        className='grid md:grid-cols-4 grid-cols-2 gap-4'
                                                    >
                                                        {serviceImages.map((preview, index) => (
                                                            <div key={preview.id} className='relative flex justify-center'>
                                                                <img
                                                                    className="w-48 h-aut object-cover" // Added object-cover for better image fit
                                                                    src={preview.url}
                                                                    alt={`Service Image ${index + 1}`} // It's better for accessibility to provide a more descriptive alt attribute
                                                                />
                                                                <div className='absolute top-3 right-2 flex items-center'>
                                                                    <button onClick={() => deleteImage(preview.id)}>
                                                                        <CrossIcon1 width={20} height={20} customCSS={'invert'} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </ReactSortable>

                                                </div>
                                            </div>

                                            <p className="normal-case text-xs text-gray-500 mt-4">*Upload images so that people can understand your services better</p>
                                        </section>
                                    </section>

                                    {/* Video & Deck Section */}
                                    <section className="video-and-deck-section mb-10 flex sm:flex-row flex-col gap-10">

                                        <section className={`video-section ${mainSectionCSS} h-auto`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>video</p>
                                            {!serviceVideo ?
                                                <>
                                                    <section className="input-fields flex flex-col gap-10 mb-4 w-fit cursor-pointer">
                                                        <label className='cursor-pointer'>
                                                            <VideoUploadIcon1 width={105} height={100} customCSS={""} />
                                                            <input type="file" className='hidden' accept=".mp4" onChange={handleServiceVideoChange} />
                                                        </label>
                                                    </section>
                                                </>
                                                :
                                                <>
                                                    <div className="relative">
                                                        <video width="400" height="300" controls>
                                                            <source src={serviceVideo as string} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                        <button className='absolute top-1 right-1 cursor-pointer' onClick={() => { setserviceVideo(""); setserviceVideoFile(null); }}>
                                                            <CrossIcon1 width={20} height={20} customCSS={""} />
                                                        </button>
                                                    </div>
                                                </>
                                            }

                                            <p className="normal-case text-xs text-gray-500">*Upload your video for people to understand it better.</p>
                                        </section>

                                        <section className={`deck-section ${mainSectionCSS} h-fit`}>
                                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>deck</p>
                                            {!serviceDeck ?
                                                <>
                                                    <section className="input-fields flex flex-col gap-10 mb-4 w-fit cursor-pointer">
                                                        <label className='cursor-pointer'>
                                                            <PDFUploadIcon1 width={105} height={100} customCSS={""} />
                                                            <input type="file" className='hidden' accept="application/pdf" onChange={handleServiceDeckChange} />
                                                        </label>
                                                    </section>
                                                    <p className="normal-case text-xs text-gray-500">*Upload your funding deck for people to understand it better.</p>
                                                </>
                                                :
                                                <>
                                                    <div className="relative w-fit">
                                                        <PDFIcon1 width={100} height={100} customCSS={"invert"} />
                                                        <button className='absolute top-1 right-1 cursor-pointer' onClick={() => { setserviceDeck(""); setserviceDeckFile(null); }}>
                                                            <CrossIcon1 width={20} height={20} customCSS={""} />
                                                        </button>
                                                    </div>
                                                    {pdfFileName &&
                                                        <p className="capitalize mt-4"> file name <span className="mt-4 normal-case">{pdfFileName}</span> </p>
                                                    }
                                                </>
                                            }
                                        </section>
                                    </section>

                                    <button onClick={updateServiceInformation} className="update-button mt-10 flex m-auto w-fit">
                                        {merchantData?.service.serviceCategory ?
                                            <ButtonComponent1 middleSide={"update"} customButtonCSS={"!px-20 !py-5 text-xl !font-bold"} />
                                            :
                                            <ButtonComponent1 middleSide={"save"} customButtonCSS={"!px-20 !py-5 text-xl !font-bold"} />
                                        }
                                    </button>
                                </section>
                            }

                            {activeTab === 'funding info' &&
                                <FundingInformationComponent
                                    userName={userName}
                                    fundingData={merchantData?.funding || ""}
                                    onClick={() => handleButtonClick('funding info')}
                                    currency={merchantData?.service.serviceCurrency || ""} />
                            }

                            {activeTab === 'VVIP deals info' &&
                                <VVIPDealsComponent merchantData={merchantData} />
                            }

                        </section>
                    </section>
                </>
            }

            {!loading &&
                <section className={` ${popUpTime === 0 ? "hidden" : "block"} pop-up-component fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-sm z-50`}>
                    <PopUpComponent message={message} start={showPopup} time={popUpTime} />
                </section>
            }
        </>
    )
}

export default MerchantProfilePage