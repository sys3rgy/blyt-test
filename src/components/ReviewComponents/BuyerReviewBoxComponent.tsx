import { CrossIcon1 } from "@/images/ImagesExport"
import ButtonComponent1 from "../CommonComponents/ButtonComponent1"
import { SetStateAction, useState, useEffect } from "react";
import PopUpComponent from "../PopUpComponents/PopUpComponent";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BuyerReviewBox {
    cancelReview: () => void;
    itemsList: any;
}

const BuyerReviewBoxComponent: React.FC<BuyerReviewBox> = ({ cancelReview, itemsList }) => {

    const [reviewText, setreviewText] = useState('');
    const [selectedStars, setSelectedStars] = useState(0);
    const handleStarClick = (star: SetStateAction<number>) => {
        setSelectedStars(star);
    };

    const [loading, setloading] = useState(false);

    //! Popup fields
    const [showPopup, setshowPopup] = useState(false);
    const [popUpTime, setpopUpTime] = useState(0);
    const [message, setmessage] = useState('');

    const [hideSubmitButton, sethideSubmitButton] = useState(false);

    async function updateReview() {

        sethideSubmitButton(true);

        const data = {
            orderId: itemsList._id,
            buyerId: itemsList.buyerId,
            buyerName: itemsList.buyerUserName,
            reviewText,
            selectedStars,
            buyerProfilePic: itemsList.buyerProfilePic,
            merchantId: itemsList.merchantId._id,
            merchantUserName: itemsList.merchantId.userName || itemsList.merchantUserName,
            merchantBusinessName: itemsList.merchantId.businessName || itemsList.merchantBusinessName,
            merchantPackageName: itemsList.packageName,
            rating: selectedStars,
            comment: reviewText
        };

        const response = await axios.post('/api/commonAPIs/reviewOrder', data);

        const statusCode = response.data.statusCode;
        if (statusCode === 404) {
            // window.location.href = "/";
            return;
        }

        const message = response.data.message;

        if (statusCode === 204) {
            toast.error(message, {});
            return;
        }

        setloading(true);
        setpopUpTime(3);
        setshowPopup(true);
        setmessage(message);
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (popUpTime !== 0) {
                window.location.reload();
            }

            setpopUpTime(0);
        }, popUpTime * 1000 * 1.5);

        // Clean up the timeout to avoid memory leaks
        return () => clearTimeout(timeoutId);
    }, [popUpTime]);


    return (
        <>
            <section className="bg-white rounded-xl drop-shadow-xl relative px-4 py-4 w-1/2 m-auto">
                <div className="absolute top-2 right-2" onClick={cancelReview}>
                    <CrossIcon1 width={15} height={15} customCSS={""} />
                </div>

                <div className="title capitalize font-bold text-2xl mb-4">review</div>

                <div className="mb-2">How did we do?</div>


                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        onClick={() => handleStarClick(index + 1)}
                        className={`${index < selectedStars ? 'text-[#FFC107]' : 'text-gray-500'} text-3xl mr-4 cursor-pointer`}
                    >
                        &#9733;
                    </span>
                ))}

                <div className="mt-4">Write a review</div>
                <textarea rows={4} className="border border-black w-full rounded-lg pl-3 pt-3 h-[150px] my-2"
                    value={reviewText}
                    onChange={(e) => setreviewText(e.target.value)}
                />

                {!hideSubmitButton &&
                    <div onClick={() => { updateReview(); }} className={`${(reviewText.trim().split(/\s+/).length <= 10 || !selectedStars) ? "cursor-not-allowed opacity-50" : "cursor-pointer"} flex justify-end`}>
                        <ButtonComponent1 middleSide={"submit"} />
                    </div>
                }
            </section>

            {loading &&
                <section className={` ${popUpTime === 0 ? "hidden" : "block"} pop-up-component fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50`}>
                    <PopUpComponent message={message} start={showPopup} time={popUpTime} />
                </section>
            }
        </>
    )

}
export default BuyerReviewBoxComponent