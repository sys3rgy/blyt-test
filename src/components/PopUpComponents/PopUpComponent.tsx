import { PopupFail1, PopupSuccessImage1 } from "@/images/ImagesExport";
import React, { useEffect, useState } from "react";

interface PopUpComponentInterface {
    time: number;
    message: string;
    start: boolean;
}

const PopUpComponent: React.FC<PopUpComponentInterface> = ({ message, start, time }) => {

    const [countDown, setCountDown] = useState(time)
    const [startComponent, setstartComponent] = useState(start)

    useEffect(() => {
        if (startComponent && countDown > 0) {
            const intervalId = setInterval(() => {
                setCountDown(prevCountDown => prevCountDown - 1);

                if (countDown <= 0) {
                    clearInterval(intervalId);
                    setstartComponent(false);
                    setCountDown(0);
                }
            }, 1000);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [countDown, startComponent, time]);

    const calculatePercentage = () => {
        return (countDown / time) * 100;
    };

    return (
        <>
            <section className={`bg-white px-10 py-6 flex flex-col justify-center items-center rounded-lg drop-shadow-lg gap-y-4`}>
                <PopupSuccessImage1 width={350} height={350} customCSS={"sm:w-[350px] min-w-[250px]"} />
                {/* <PopupFail1 width={350} height={350} customCSS={"sm:w-[350px] min-w-[250px]"} /> */}
                <p className="text-green-500 font-bold text-center sm:text-2xl text-base">{message}</p>

                <div className="text-xs font-bold relative w-[50px] h-[50px]">
                    <svg className="absolute" viewBox="0 0 36 36" width="100%" height="100%">
                        <circle
                            className="stroke-current text-green-500"
                            strokeWidth="2"
                            fill="transparent"
                            r="16"
                            cx="18"
                            cy="18"
                            style={{
                                strokeDasharray: `${calculatePercentage()} 100`,
                                transition: "stroke-dasharray 1s linear",
                            }}
                        ></circle>
                    </svg>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{countDown}</div>
                </div>
            </section>
        </>
    )
}

export default PopUpComponent;