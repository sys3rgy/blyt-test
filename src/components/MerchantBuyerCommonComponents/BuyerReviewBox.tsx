import { roxboroughcfFont } from "@/fonts/Fonts"
import { NoImageIcon1, StarIcon2 } from "@/images/ImagesExport"

interface BuyerReviewBoxProps {
    items: any
}

const BuyerReviewBox: React.FC<BuyerReviewBoxProps> = ({ items }) => {

    return (
        <>
            <section key={items._id} className={`my-package-box flex my-4`}>
                <section className="right-side-details-box bg-white w-full lg:mr-5 mr-0 rounded-r-lg sm:px-8 px-2 sm:py-4 py-2 flex justify-between drop-shadow-lg rounded-lg">
                    <section className='left-side-section w-full'>
                        <section className='package-image-name-merchant-userName-price-range-section flex justify-between gap-1'>
                            <div className='merchant-image-package-name-userName flex items-center sm:gap-4 gap-1'>
                                <span className='package-image left-side'>

                                    {items.buyerProfilePic ?
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            className='rounded-full'
                                            width={80}
                                            height={80}
                                            src={items.buyerProfilePic}
                                            alt="Order package"
                                        />
                                        :
                                        <NoImageIcon1 width={80} height={80} customCSS={'sm:min-w-[80px] sm:w-0 w-96 rounded-lg drop-shadow-lg'} />
                                    }

                                </span>
                                <span className="right-side">
                                    <p className={`${roxboroughcfFont.className} font-bold sm:text-lg text-sm`}><span className='capitalize font-normal'> </span> {items.buyerName} </p>
                                    <p className='font-bold text-sm'> {items.merchantBusinessName} </p>
                                    <p className='sm:text-sm text-xs my-[2px]'> {items.merchantUserName} </p>
                                </span>
                            </div>

                            <div className={`${items.rating === 1 ? "bg-red-500" :
                                items.rating === 2 ? "bg-yellow-500" :
                                    items.rating === 3 ? "bg-green-400" :
                                        items.rating === 4 ? "bg-green-600" :
                                            items.rating === 5 ? "bg-[#9F885E]" :
                                                ""} text-white h-fit px-2 font-bold flex items-baseline rounded-lg drop-shadow-lg`}>
                                <p className='flex items-center gap-1'>{items.rating} <StarIcon2 width={15} height={15} customCSS={''} /></p>
                            </div>
                        </section>

                        <div className='package-name-and-description flex flex-col mt-4'>
                            <span className="about-package font-bold sm:text-lg text-sm capitalize">{items.merchantPackageName}</span>
                            <span>{items.comment}</span>
                        </div>
                    </section>
                </section>
            </section>
        </>
    )
}

export default BuyerReviewBox