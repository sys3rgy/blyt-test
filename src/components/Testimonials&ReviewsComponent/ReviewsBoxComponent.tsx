import { poppinsFont } from "@/fonts/Fonts"
import { TestimonialsImage1 } from "@/images/ImagesExport"

const ReviewsBoxComponent: React.FC = () => {
    return (
        <>
            <section className={`${poppinsFont.className} reviews-box-component`}>
                <div className="bg-white rounded-lg drop-shadow-lg mt-8">
                    <div className="flex justify-center relative -top-8"><TestimonialsImage1 width={80} height={80} customCSS={""} /></div>
                    <div className="name capitalize text-[#9F885E] text-center font-bold px-2 text-xl -mt-6">john doe</div>
                    <div className="occipation max-w-xs text-sm text-center m-auto px-2 font-normal">
                        Director - Business Development,
                        XYZ Private Limited
                    </div>
                    <div className="review max-w-xs text-sm text-center m-auto mt-5 pb-8 px-2 italic">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus diam sapien. Phasellus rutrum justo eu ligula ultricies ullamcorper.
                    </div>
                </div>
            </section>
        </>
    )
}

export default ReviewsBoxComponent