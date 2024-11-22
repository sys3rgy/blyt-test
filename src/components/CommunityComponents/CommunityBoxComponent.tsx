import { ReactNode } from "react"
import ButtonComponent1 from "../CommonComponents/ButtonComponent1"
import { ArrowIcon1 } from "@/images/ImagesExport"
import { poppinsFont, roxboroughcfFont, truenoRegular } from "@/fonts/Fonts";

interface CommunityBoxComponent {
    imageForDesktop: ReactNode;
    imagePositionForDesktop: string;
    title: string;
    description: string;
    imageForMobile: ReactNode;
}

const CommunityBoxComponent: React.FC<CommunityBoxComponent> = ({ title, description, imageForDesktop, imageForMobile, imagePositionForDesktop }) => {
    return (
        <>
            {/* For Desktop & Tablet */}
            <div className="box bg-white rounded-lg drop-shadow-lg mt-14 h-64 sm:block hidden">
                <div className={`relative ${imagePositionForDesktop} flex items-center`}>
                    {imageForDesktop}
                    <div className="right-side ml-1 pr-4">
                        <p className={`${roxboroughcfFont.className} title capitalize font-bold text-3xl mt-8`}>{title}</p>
                        <p className={`${poppinsFont.className} font-normal about my-4`}>{description}</p>
                        <div className="flex justify-end">
                            <ButtonComponent1 leftSide={""} middleSide={"see more"} rightSide={<ArrowIcon1 width={10} height={12} customCSS={"max-h-[12px]"} />} customSectionCSS={""} customButtonCSS={""} />
                        </div>
                    </div>
                </div>
            </div>

            {/* For Mobile */}
            <div className="box bg-white rounded-lg drop-shadow-lg sm:hidden block">
                <div className="relative flex items-center">
                    {imageForMobile}
                    <div className="right-side pr-2">
                        <p className={`${roxboroughcfFont.className} title capitalize font-bold text-xl`}>{title}</p>
                        <p className={`${poppinsFont.className} font-normal about my-2 text-xs`}>{description}</p>
                        <div className="flex justify-end">
                            <ButtonComponent1 leftSide={""} middleSide={"see more"} rightSide={<ArrowIcon1 width={10} height={12} customCSS={"max-h-[12px]"} />} customSectionCSS={``} customButtonCSS={"text-xs"} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CommunityBoxComponent