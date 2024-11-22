'use client'

import HeadingComponent1 from '@/components/CommonComponents/HeadingComponent1'
import { PointsPriceList } from '@/interfaces/MerchantDashboardInterface'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { CrownIcon2, CurrencyIcon1, LoadingGif, SignInUpEmailSignIcon1, SignInUpUserIcon1 } from '@/images/ImagesExport'
import InputComonentForSignInUpPage from '@/components/CommonComponents/InputComonentForSignInUpPage'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchInitialPointsList from './FetchInitialPointsList'
import { fetchUserIP } from '@/utils/fetchUserIP'
import crypto from 'crypto';
import { getBearerToken } from '@/utils/CommercePayBearerToken'
let gkashCID: string;
if (process.env.NEXT_PUBLIC_GKASH_CID !== undefined) {
    gkashCID = process.env.NEXT_PUBLIC_GKASH_CID;
}

const PurchasePointsPage: React.FC = () => {

    const [loading, setloading] = useState(true);

    const [pointsPriceListData, setpointsPriceListData] = useState<PointsPriceList[] | null>(null);
    const [paymentScene, setpaymentScene] = useState(false);

    async function fetchPointsPrice() {
        const response = await FetchInitialPointsList();
        setpointsPriceListData(response.pointsPriceList);
        setloading(false);

        const userIP = await fetchUserIP();
        setclientIP(userIP);
    }

    useEffect(() => {
        fetchPointsPrice();
    }, [])

    const [buyerFirstName, setbuyerFirstName] = useState('');
    const [buyerLastName, setbuyerLastName] = useState('');
    const [userEmail, setuserEmail] = useState('');
    const [clientIP, setclientIP] = useState('');
    const [quantity, setquantity] = useState(1);

    const [currency, setcurrency] = useState('MYR');

    const [points, setpoints] = useState('');
    const [amount, setamount] = useState('');

    const [orderId, setorderId] = useState('');
    const [signature, setsignature] = useState('');

    async function buyPoints(points: any, price: any) {
        setpoints((points * quantity).toString());
        setamount((price * quantity).toFixed(2));
    }

    function resetHooks() {
        setbuyerFirstName("");
        setbuyerLastName("");
        setuserEmail("");
        setpoints("");
        setamount("");
    }

    const enableButton = !buyerFirstName || !buyerLastName || !userEmail

    async function getOrderId() {

        setloading(true);

        const bearerToken = await getBearerToken();

        const data = {
            bearerToken,
            amount: amount,
            currencyCode: currency,
            customer: {
                email: userEmail,
                name: buyerFirstName + buyerLastName,
                username: "string"
            },
            ipAddress: "127.0.0.1",
            referenceCode: "string",
            points: points
        };

        if (!buyerFirstName || !buyerLastName || !userEmail) {
            toast.error('Please fill all the fields.', {});
            setloading(false);
            return null;
        }

        // Checking If Email Includes 2 @ Signs
        const regexForuserEmail = /^[a-zA-Z0-9._@]+$/;

        if (userEmail.toLowerCase().includes('@', userEmail.toLowerCase().indexOf('@') + 1) || !regexForuserEmail.test(userEmail)) {
            toast.error('Invalid E-mail buddy!', {});
            setloading(false);
            return null;
        }

        const response = await axios.post('/api/buyersAPIs/buyPointsAPI', data);
        const responseData = response.data;
        console.log(responseData)
        if (responseData.statusCode === 404) {
            toast.error('Please login first!', {});
            setloading(false);
            return;
        }

        if (responseData.statusCode === 204) {
            toast.error(responseData.message, {});
            setloading(false);
            return;
        }
        console.log(responseData)
        toast.success(responseData.message, {});

        setTimeout(() => {
            window.location.href = responseData.url
        }, 1000);
    }

    return (
        <>
            {!loading &&
                <section className='purchase-points-section'>
                    <section className="max-width max-w-screen-xl m-auto px-4 mt-4 mb-4">
                        <HeadingComponent1 title={'purchase points'} customCSS={"mb-0"} lineWidth={'w-[120%]'} showRightSide={false} />
                        {!paymentScene &&
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="t text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                points
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                quantity
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                price
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-center">
                                                action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pointsPriceListData?.map((items) => (
                                            <tr key={items._id} className="bg-white border-b hover:bg-gray-50 font-bold">
                                                <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap text-center">
                                                    {items.points}
                                                </th>
                                                <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap text-center">
                                                    <select name="" id="" value={quantity} onChange={(e) => setquantity(parseInt(e.target.value, 10))}>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </th>
                                                {items.salePrice === 0 ?
                                                    <td className="px-6 py-4 text-center">
                                                        {currency} {items.price}
                                                    </td>
                                                    :
                                                    <td className="px-6 py-4 text-center">
                                                        <p>
                                                            <span>{currency}</span>
                                                            <span> {items.salePrice} </span>
                                                            <span className="text-red-500 line-through mx-1">{items.price} </span>
                                                        </p>
                                                        <span> {(items.salePrice / items.price) * 100}%off </span>
                                                    </td>
                                                }
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => { buyPoints(items.points, items.salePrice === 0 ? items.price : items.salePrice); setpaymentScene(!paymentScene); }}
                                                        className="text-white bg-[#9F885E] opacity-80 hover:opacity-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center uppercase"
                                                    >
                                                        Buy
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }


                        {paymentScene &&
                            <>
                                <button onClick={() => { setpaymentScene(!paymentScene); resetHooks(); }} className='uppercase bg-[#9F885E] text-white px-6 py-2 font-bold rounded-lg drop-shadow-lg mt-4 mb-8'>cancel</button>
                                <section className='flex flex-col gap-5'>

                                    <InputComonentForSignInUpPage customSectionCSS={"hidden"} inputName="version" title="" inputType="text" value={"1.5.5"} readonly={true} image={undefined} />

                                    <InputComonentForSignInUpPage customSectionCSS={"hidden"} inputName="CID" title="" inputType="text" value={gkashCID} readonly={true} image={undefined} />

                                    <InputComonentForSignInUpPage customSectionCSS={"hidden"} inputName="clientip" title="" inputType="text" value={clientIP} readonly={true} image={undefined} />

                                    <section className="section-1 flex justify-between gap-5">

                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} inputName="v_firstname" title="first name"
                                            image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                            inputType="text"
                                            value={buyerFirstName}
                                            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setbuyerFirstName(e.target.value)} />

                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} inputName="v_lastname" title="last name"
                                            image={<SignInUpUserIcon1 width={20} height={20} customCSS={''} />}
                                            inputType="text"
                                            value={buyerLastName}
                                            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setbuyerLastName(e.target.value)} />

                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} inputName="v_billemail" title="email"
                                            image={<SignInUpEmailSignIcon1 width={20} height={20} customCSS={''} />}
                                            inputType="text"
                                            value={userEmail}
                                            onChange={(e: { target: { value: React.SetStateAction<string> } }) => setuserEmail(e.target.value)} />

                                    </section>

                                    <section className="section-2 flex justify-between gap-5">

                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} inputName="v_currency" title="currency" inputType="text" value={currency} readonly={true} image={<CurrencyIcon1 width={20} height={20} customCSS={''} />} />

                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} inputName="v_amount" title="amount" inputType="text" value={amount} readonly={true} image={undefined} />

                                        <InputComonentForSignInUpPage customSectionCSS={"w-full"} inputName="" title="points" inputType="text" value={points} readonly={true} image={<CrownIcon2 width={20} height={20} customCSS={'invert'} />} />

                                    </section>

                                    <button onClick={() => getOrderId()} className={`${enableButton ? "hidden" : "block"} uppercase font-bold text-lg text-white bg-[#9F885E] px-6 py-2 w-fit rounded-lg drop-shadow-lg m-auto`}>submit</button>

                                </section>
                            </>
                        }
                    </section>
                </section >
            }
        </>
    )
}

export default PurchasePointsPage

{/* 

*/}