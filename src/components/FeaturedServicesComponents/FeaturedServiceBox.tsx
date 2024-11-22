/* eslint-disable @next/next/no-img-element */
import { ArrowIcon1, FeaturedServicesTestIcon1, FeaturedServicesTestImage1, StarIcon1 } from "@/images/ImagesExport";
import ButtonComponent1 from "../CommonComponents/ButtonComponent1";
import { poppinsFont, roxboroughcfFont } from "@/fonts/Fonts";

interface FeaturedServiceBox {
    backgroundImage: string;
    companyLogo: string;
    companyName: string;
    companycategory: string;
}

const FeaturedServiceBox: React.FC<FeaturedServiceBox> = ({ backgroundImage, companyLogo, companyName, companycategory }) => {
    return (
        <>
            <div className="feature-service-box sm:w-[281px] sm:h-[353px] w-auto h-auto bg-white rounded-lg drop-shadow-lg relative">
                <div className="merchant-company-bg-image">
                    <img className="sm:w-[281px] sm:h-[139px] w-[200px] h-auto" src={backgroundImage} alt={backgroundImage} />
                </div>

                <div className="merchant-company-logo absolute sm:top-[28%] sm:-translate-y-0 top-[40%] -translate-y-1/2 left-1/2 -translate-x-1/2 drop-shadow-lg">
                    <img className="sm:w-20 w-12" src={companyLogo} alt={companyLogo} />
                </div>

                <div className={`${poppinsFont.className} font-normal ratings sm:flex hidden items-center text-xs ml-2 mt-2 gap-1`}>
                    <StarIcon1 width={17} height={17} customCSS={""} /> <span>4.9 (1.9k)</span>
                </div>


                <div className={`${poppinsFont.className} font-normal ratings sm:hidden flex items-center absolute top-[55%] -translate-y-1/2 left-1/2 -translate-x-1/2 drop-shadow-lg text-xs mt-1`}>
                    <StarIcon1 width={17} height={17} customCSS={""} /> <span>4.9 (1.9k)</span>
                </div>

                <div className={`${roxboroughcfFont.className} font-bold merchant-company-name text-center sm:mt-8 mt-12 sm:text-lg text-base`}>
                    {companyName}
                </div>

                <div className={`${poppinsFont.className} font-bold merchant-company-category text-center sm:mt-4 mt-0 text-xs text-[#3C515D]`}>
                    {companycategory}
                </div>

                <div className="merchant-company-see-more-button sm:mt-8 mt-2 sm:mb-0 mb-3">
                    <ButtonComponent1
                        leftSide={""}
                        middleSide={"connect now"}
                        rightSide={<ArrowIcon1 width={10} height={12} customCSS={"sm:max-h-[12px]"} />}
                        customButtonCSS="sm:text-base text-xs"
                    />
                </div>
            </div>
        </>
    )
}

export default FeaturedServiceBox;