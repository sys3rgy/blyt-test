"use client";

import { poppinsFont, roxboroughcfFont } from "@/fonts/Fonts";
import { AboutUsImage1, IntroLine1 } from "@/images/ImagesExport";
import { useEffect, useState } from "react";

const AboutUsPage: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<main className="flex-grow flex justify-center items-center bg-[#9F885E] bg-opacity-20">
				<section className={`about-us-section text-black h-full w-full`}>
					<section
						className={
							"max-width max-w-screen-xl m-auto flex lg:flex-row flex-col justify-between items-center lg:gap-10 gap-4 px-4 py-2 h-full"
						}
					>
						<section
							className={`${roxboroughcfFont.className} font-bold left-side h-full flex flex-col justify-center z-50 lg:min-w-[460px] min-w-[343px] max-w-[500px]`}
						>
							<p className="line-1 capitalize sm:text-5xl text-3xl font-bold">Dashboard</p>

							<p className="image-1 lg:my-6 my-2">
								<IntroLine1 width={430} height={1} customCSS={"sm:w-full w-[300px]"} />
							</p>

							<p
								className={`${poppinsFont.className} font-normal line-2 capitalize text-black sm:text-base text-sm mb-10`}
							>
								At <span className="uppercase">blyt</span>, we`re more than just a company; we`re your
								strategic partner in building lasting customer relationships and driving business
								growth.
							</p>

							<p
								className={`${poppinsFont.className} font-normal line-3 capitalize text-black sm:text-base text-sm`}
							>
								Our journey began with a passion for helping businesses like yours succeed in today`s
								competitive landscape by using loyalty and essential technologies.
							</p>
						</section>

						<section className="right-side lg:pl-0 sm:mt-0 mt-10">
							<AboutUsImage1 width={477} height={509} customCSS={"sm:max-w-[477px] w-auto h-auto"} />
						</section>
					</section>
				</section>
			</main>
		</>
	);
};

export default AboutUsPage;
