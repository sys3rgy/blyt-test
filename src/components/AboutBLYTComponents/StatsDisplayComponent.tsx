import { poppinsFont } from "@/fonts/Fonts";
import { ReactNode } from "react";

interface StatsDisplayComponent {
    image: ReactNode;
    title1: string;
    title2: string;
}

const StatsDisplayComponent: React.FC<StatsDisplayComponent> = ({ image, title1, title2 }) => {
    return (
        <>
            <span className={`${poppinsFont.className} capitalize flex gap-2 sm:m-0 mx-auto justify-center`}>
                <section className="left-side flex items-center">
                    {image}
                </section>
                <section className="right-side my-auto lg:w-auto w-[170px]">
                    <p className="text-gray-500 font-normal">{title1}</p>
                    <p className="text-xl font-bold">{title2}</p>
                </section>
            </span>
        </>
    )
}

export default StatsDisplayComponent