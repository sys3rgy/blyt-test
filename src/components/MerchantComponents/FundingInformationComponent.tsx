'use client'

import React, { useEffect, useState } from 'react'
import InputComonentForSignInUpPage from "@/components/CommonComponents/InputComonentForSignInUpPage";
import { CrossIcon1, LoadingGif, PDFIcon1, PDFUploadIcon1, PencilIcon2, SignInUpBriefcaseIcon1, VideoUploadIcon1 } from "@/images/ImagesExport";
import ButtonComponent1 from '../CommonComponents/ButtonComponent1';
import axios from 'axios';
import { toast } from 'react-toastify';
import PopUpComponent from '../PopUpComponents/PopUpComponent';
import { CurrencyList } from '@/interfaces/MerchantDashboardInterface';

import CurrencyListJSON from '@/constants/CurrencyList.json';
import { roxboroughcfFont } from '@/fonts/Fonts';

const mainSectionCSS = "bg-white w-full border border-[#9F885E] rounded-lg drop-shadow-lg lg:px-20 px-5 lg:py-10 py-5";

interface FundingInformationComponentProps {
    userName: string;
    fundingData: any;
    onClick: (tabName: string) => void;
    currency: string;
}

const FundingInformationComponent: React.FC<FundingInformationComponentProps> = ({ userName, fundingData, onClick, currency }) => {

    const [fundingStage, setfundingStage] = useState(fundingData?.fundingStage || "");
    const [fundingCurrency, setfundingCurrency] = useState(fundingData?.fundingCurrency);
    const [fundingAmount, setfundingAmount] = useState(fundingData?.fundingAmount || "");
    const [fundingDescription, setfundingDescription] = useState(fundingData?.fundingDescription || "");

    const [fundingPDF, setfundingPDF] = useState<File | string | null>(fundingData?.fundingDeck || null);
    const [fundingPDFileName, setfundingPDFileName] = useState('');
    const [fundingPDFFile, setfundingPDFFile] = useState<File | null>(null);

    const [loading, setloading] = useState(false);

    //! Popup fields
    const [showPopup, setshowPopup] = useState(false);
    const [popUpTime, setpopUpTime] = useState(0);
    const [message, setmessage] = useState('');

    async function addFundingData() {

        setloading(true);

        const formData = new FormData();

        formData.append("fundingStage", fundingStage)
        formData.append("fundingCurrency", fundingCurrency)
        formData.append("fundingAmount", fundingAmount)
        formData.append("fundingDescription", fundingDescription)
        formData.append("isFundingInformation", 'true')
        formData.append("userName", userName)

        //~ Funding PDF File
        if (fundingPDFFile) {
            formData.append("serviceDeck", fundingPDFFile as File, fundingPDFFile?.name as string);
        } else {
            formData.append("serviceDeck", fundingPDF as string);
        }

        const response = await axios.put(`/api/merchantsAPIs/merchantAccountDataFetchUpdateAPI?userName`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const statusCode = response.data.statusCode;
        const message = response.data.message;

        if (statusCode === 206) {
            setloading(false);
            toast.error(message, {})
            return;
        }

        onClick('funding info');

        setpopUpTime(3);
        setshowPopup(true);
        setmessage(message);

        setloading(false);
    }

    //~ Funding PDF Upload Code
    function handleFundingPDFChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {

            if (e.target.files[0].size >= 1024 * 1024) {
                alert("Maximum file size is 1MB.")
                return;
            }

            const file = e.target.files[0];
            const pdfUrl = URL.createObjectURL(file);
            setfundingPDFileName(file.name);
            setfundingPDF(pdfUrl);
            setfundingPDFFile(file);
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
        <div>

            {loading &&
                <section className={`loading-icon fixed w-full h-full top-0 left-0 right-0 bottom-0 flex justify-center backdrop-blur-sm`}>
                    <LoadingGif width={250} height={250} />
                </section>
            }

            {!loading &&
                <>
                    <section className="services-section mb-10">
                        <section className={`${mainSectionCSS}`}>
                            <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>funding</p>
                            <section className="input-fields flex flex-col gap-10">
                                <section className="inputs-1 flex sm:flex-row flex-col justify-between gap-10">

                                    <InputComonentForSignInUpPage customSectionCSS={"min-w-[200px]"} title={"funding stage"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"name"}
                                        value={fundingStage}
                                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setfundingStage(e.target.value)}
                                    />

                                    <div className="price-range flex sm:flex-row flex-col gap-10 w-full">
                                        <section className="inputs-2 flex sm:flex-row flex-col justify-between gap-10 relative w-full">
                                            <div className="absolute top-1/2 -translate-y-1/2 left-2"><SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} /></div>
                                            <div className="absolute capitalize font-bold bg-white px-2 -top-3 left-5">currency</div>
                                            <select className="w-full border border-black rounded-lg pl-8 py-3 bg-transparent default:" value={fundingCurrency} onChange={(e) => setfundingCurrency(e.target.value)}>
                                                <option value="">Select Currency</option>
                                                {CurrencyListJSON.map((item: CurrencyList) => {
                                                    if (item.cc === "USD" || item.cc === currency) {
                                                        return (
                                                            <option key={item.cc} value={item.cc}>
                                                                {item.name} - ({item.cc}) - {`${item.symbol}`}
                                                            </option>
                                                        );
                                                    }
                                                })}

                                            </select>
                                        </section>
                                    </div>

                                    <InputComonentForSignInUpPage customSectionCSS={"min-w-[180px]"} title={"funding amount"} customTitleCSS={"bg-white"} image={<SignInUpBriefcaseIcon1 width={20} height={20} customCSS={''} />} inputType={"number"}
                                        value={fundingAmount}
                                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setfundingAmount(e.target.value)}
                                    />

                                </section>

                                <section className="inputs-3 flex sm:flex-row flex-col justify-between gap-10 relative">
                                    <textarea rows={4} className="border border-black w-full rounded-lg pt-3 pl-8" value={fundingDescription} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setfundingDescription(e.target.value)}></textarea>
                                    <p className="title capitalize absolute -top-3 left-5 bg-white px-2 font-bold">description</p>
                                    <p className="pencil-icon absolute top-[15px] left-2"> <PencilIcon2 width={20} height={20} customCSS={''} /> </p>
                                </section>

                            </section>
                        </section>
                    </section>

                    <section className={`funding-deck-pdf-section ${mainSectionCSS} h-auto !w-1/2`}>
                        <p className={`${roxboroughcfFont.className} font-bold capitalize text-xl mb-10`}>deck</p>

                        {!fundingPDF ?
                            <>
                                <section className="input-fields flex flex-col gap-10 mb-4 w-fit cursor-pointer">
                                    <label className='cursor-pointer'>
                                        <PDFUploadIcon1 width={105} height={100} customCSS={""} />
                                        <input type="file" className='hidden' accept="application/pdf" onChange={handleFundingPDFChange} />
                                    </label>
                                </section>
                                <p className="normal-case text-xs text-gray-500">*Upload your funding deck for people to understand it better.</p>
                            </>
                            :
                            <>
                                <div className="relative w-fit">
                                    <PDFIcon1 width={100} height={100} customCSS={"invert"} />
                                    <button className='absolute top-1 right-1 cursor-pointer' onClick={() => { setfundingPDF(""); setfundingPDFFile(null); }}>
                                        <CrossIcon1 width={20} height={20} customCSS={""} />
                                    </button>
                                </div>
                                {fundingPDFileName &&
                                    <p className="capitalize mt-4"> file name <span className="mt-4 normal-case">{fundingPDFileName}</span> </p>
                                }
                            </>
                        }

                    </section>

                    <button onClick={() => { addFundingData(); }} className="addFundingData mt-10 flex m-auto w-fit">
                        <ButtonComponent1 middleSide={"save"} customButtonCSS={"!px-20 !py-5 text-xl !font-bold"} />
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

export default FundingInformationComponent