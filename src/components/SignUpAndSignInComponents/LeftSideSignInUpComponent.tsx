import { CompanyLogo1 } from "@/images/ImagesExport";
import IntroImage1 from "@/images/IntroImages/IntroImage1";

const LeftSideSignInUpComponent: React.FC = () => {
    return (
        <>
            <CompanyLogo1 width={285} height={55} customCSS={''} />
            <IntroImage1 width={476} height={216} customCSS={'lg:min-w-[476px] min-w-[376px]'} />
            <p className="line-2 capitalize text-[#3C515D] lg:text-4xl text-xl font-bold sm:mb-20 mb-4">
                business loyalty for all
            </p>
        </>
    )
}

export default LeftSideSignInUpComponent;