'use client'

import { poppinsFont, roxboroughcfFont } from "@/fonts/Fonts";
import { PlusIconInCircle1 } from "@/images/ImagesExport"
import Link from "next/link";

interface HeadingComponent1 {
    customCSS?: string;
    title: string
    lineWidth: string
    showRightSide: boolean
    linkHref?: string;
}

const HeadingComponent1: React.FC<HeadingComponent1> = ({ customCSS, title, lineWidth, showRightSide, linkHref }) => {
    return (
        <>
            <section className={`${customCSS} heading-component-1-section max-w-screen-xl m-auto flex justify-between mb-10`}>
                <section className="left-side sm:text-2xl text-base font-bold">
                    <div className={`${roxboroughcfFont.className} font-bold title capitalize`}>{title}</div>
                    <div className={`${lineWidth} line border-2 rounded-full border-[#9F885E] mt-2`}></div>
                </section>
                {showRightSide &&
                    <Link href={linkHref || ""}>
                        <section className={`${poppinsFont.className} font-normal right-side flex items-center gap-2 uppercase text-base`}>
                            see more <PlusIconInCircle1 width={25} height={25} customCSS={""} />
                        </section>
                    </Link>
                }
            </section>
        </>
    )
}

export default HeadingComponent1