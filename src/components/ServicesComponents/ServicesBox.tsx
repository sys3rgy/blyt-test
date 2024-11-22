/* eslint-disable @next/next/no-img-element */
import { ArrowIcon1, NoImageIcon1, StarIcon1 } from "@/images/ImagesExport";
import ButtonComponent1 from "../CommonComponents/ButtonComponent1";
import Link from "next/link";
import { poppinsFont, roxboroughcfFont } from "@/fonts/Fonts";
import { SyntheticEvent } from "react";

interface ServicesBox {
    backgroundImage: any;
    companyLogo: string;
    companyName: string;
    companycategory: string;
    companyPageLink: string;
    averageRatings: number;
    dealsCount: number;
}

const ServicesBox: React.FC<ServicesBox> = ({ backgroundImage, companyLogo, companyName, companycategory, companyPageLink, averageRatings, dealsCount }) => {

    function handleBannerError(event: SyntheticEvent<HTMLImageElement, Event>) {
        const target = event.target as HTMLImageElement;
        console.error("Image failed to load:", target.src);
        target.src = "/images/MerchantDashboardImages/default-banner-1.jpg";
    }

    function handleCompanyIconError(event: SyntheticEvent<HTMLImageElement, Event>) {
        const target = event.target as HTMLImageElement;
        // You can handle the error here
        console.error("Image failed to load:", target.src);
        // Optionally, you can set a fallback source
        target.src = "/images/CommonImages/no-image-icon-1.png";
    }

    return (
        <>
            <div className="feature-service-box sm:min-w-[240px] sm:max-w-max min-w-[260px] max-w-[300px] h-[353px] bg-white rounded-lg drop-shadow-lg relative">
                <div className="merchant-company-bg-image">
                    <img className="w-auto h-[140px] rounded-t-lg object-cover object-center" width={281} height={139} src={backgroundImage} alt={backgroundImage} onError={handleBannerError} />
                </div>

                <div className="merchant-company-logo absolute top-[27%] left-1/2 -translate-x-1/2 drop-shadow-lg">
                    {!companyLogo ?
                        <NoImageIcon1 width={80} height={80} customCSS={'sm:w-20 w-10 rounded-full'} />
                        :
                        <img className="w-20 h-20 rounded-lg drop-shadow-lg" width={80} height={80} src={companyLogo} alt={companyLogo} onError={handleCompanyIconError} />
                    }
                </div>

                <div className="ratings flex items-center text-xs ml-2 mt-1 font-medium gap-1">
                    <span>{Math.round(averageRatings * 10) / 10}</span><StarIcon1 width={17} height={17} customCSS={""} />
                </div>

                <div className={`${roxboroughcfFont.className} merchant-company-name text-center mt-8 font-bold text-lg px-1`}>
                    {companyName}
                </div>

                <div className={`${poppinsFont} font-medium merchant-company-category text-center mt-2 teeny:text-sm text-xs`}>
                    {companycategory}
                </div>

                <div className="merchant-company-see-more-button absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap drop-shadow-lg">
                    <Link href={companyPageLink}>
                        <ButtonComponent1 leftSide={""} middleSide={"connect now"} rightSide={<ArrowIcon1 width={10} height={12} customCSS={"min-w-[10px] min-h-[12px]"} />} />
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ServicesBox;