import { NoImageIcon1, PDFIcon1, StarIcon2 } from "@/images/ImagesExport"
import ButtonComponent1 from "../CommonComponents/ButtonComponent1"
import Link from "next/link"

interface FundingViewComponentProps {
    items: any
}

const FundingViewComponent: React.FC<FundingViewComponentProps> = ({ items }) => {

    return (
        <>
            <section className="funding-view-component flex flex-col gap-4 mt-4">

                <div className="finding-stage">
                    <span className="font-bold capitalize"> funding stage: </span>
                    <span>{items.fundingStage || ""}</span>
                </div>

                <div className="finding-stage">
                    <span className="font-bold capitalize"> funding amount: </span>
                    <span>{items.fundingCurrency || ""} {items.fundingAmount || ""}</span>
                </div>

                <div className="finding-stage flex flex-col">
                    <span className="font-bold capitalize"> funding description: </span>
                    <span>{items.fundingDescription || ""}</span>
                </div>

                <Link href={items.fundingDeck || ""} className="company-deck-download drop-shadow-lg rounded-lg cursor-pointer">
                    <ButtonComponent1
                        middleSide="view your deck"
                        rightSide={<PDFIcon1 width={40} height={40} customCSS={''} />}
                        customButtonCSS="px-8 py-4 w-fit !m-0" />
                </Link>

            </section>
        </>
    )
}

export default FundingViewComponent