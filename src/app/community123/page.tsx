'use client'

import ButtonComponent1 from "@/components/CommonComponents/ButtonComponent1";
import HeadingComponent1 from "@/components/CommonComponents/HeadingComponent1";
import { DataContext } from "@/context/DataContext";
import { playfairDisplayFont, poppinsFont, roxboroughcfFont, truenoRegular } from "@/fonts/Fonts";
import { AboutUsImage1, ArrowOnTarget1, ArrowsInsideBigArrowIcon1, IntroLine1, UserThinkingIcon1, UsersWithStarOnHeadIcon1 } from "@/images/ImagesExport";
import LoginRegisterPopUp from "@/layouts/LoginRegisterPopUp";
import { useContext, useState } from "react";


const CommunityPage: React.FC = () => {

    const { isSessionExist } = useContext(DataContext);

    const [showSignInScene, setShowSignInScene] = useState(false);
    const [showRegisterScene, setshowRegisterScene] = useState(false)
    function resetSceneState() {
        setShowSignInScene(false);
        setshowRegisterScene(false);
    }

    return (
        <>
            <section className={`${(showSignInScene || showRegisterScene) ? "blur-sm pointer-events-none" : ""}`}>
                <section className={`about-us-section bg-[#9F885E] bg-opacity-20 text-black relative`}>

                    <section className={"max-width max-w-screen-xl m-auto flex lg:flex-row flex-col justify-between items-center lg:gap-10 gap-4 px-4 py-2"}>

                        <section className={`${roxboroughcfFont.className} font-bold left-side lg:h-[45vh] h-auto flex flex-col justify-center z-50 lg:min-w-[460px] min-w-[343px] max-w-[500px]`}>
                            <p className="line-1 capitalize sm:text-5xl text-3xl font-bold">
                                about us
                            </p>

                            <p className="image-1 lg:my-6 my-2">
                                <IntroLine1 width={430} height={1} customCSS={"sm:w-full w-[300px]"} />
                            </p>

                            <p className={`${poppinsFont.className} font-normal line-2 capitalize text-black sm:text-base text-sm mb-10`}>
                                At <span className="uppercase">blyt</span>, we`re more than just a company; we`re your strategic partner in building lasting customer relationships and driving business growth.
                            </p>

                            <p className={`${poppinsFont.className} font-normal line-3 capitalize text-black sm:text-base text-sm`}>
                                Our journey began with a passion for helping businesses like yours succeed in today`s competitive landscape by using loyalty and essential technologies.
                            </p>
                        </section>

                        <section className="right-side lg:pl-0 sm:mt-0 mt-10">
                            <AboutUsImage1 width={477} height={509} customCSS={"sm:max-w-[477px] w-auto h-auto"} />
                        </section>

                    </section>
                </section>
 

                <section className="why-us-section">
                    <section className="max-width max-w-screen-xl m-auto flex flex-col px-4 py-8">
                        <section className="heading">
                            <HeadingComponent1 title={"why us"} lineWidth={"w-[120%]"} customCSS={"!mb-4"} showRightSide={false} />
                        </section>
                        <section className="mission-description font-bold md:text-xl sm:text-base text-xs flex flex-col justify-between md:gap-16 sm:gap-10 gap-4">
                            <div className="why-us-1 flex items-center md:gap-16 sm:gap-10 gap-4">
                                <section className="left-side">
                                    <UsersWithStarOnHeadIcon1 width={100} height={100} customCSS={"md:min-w-[100px] md:h-auto min-w-[63px] minh-[63px]"} />
                                </section>

                                <section className="right-side">
                                    <div className={`${playfairDisplayFont.className} font-bold heading capitalize md:text-xl text-sm md:mb-4 mb-2`}>
                                        customer-centric Focus
                                    </div>
                                    <div className="md:text-base text-xs font-normal">
                                        We understand the value of your customers. Our programs are designed to enhance their experience, foster loyalty, and drive repeat business.
                                    </div>
                                </section>
                            </div>

                            <div className="why-us-2 flex items-center md:gap-16 sm:gap-10 gap-4">
                                <section className="left-side">
                                    <ArrowsInsideBigArrowIcon1 width={100} height={100} customCSS={"md:min-w-[100px] md:h-auto min-w-[63px] minh-[63px]"} />
                                </section>

                                <section className="right-side">
                                    <div className={`${playfairDisplayFont.className} font-bold heading capitalize md:text-xl text-sm md:mb-4 mb-2`}>
                                        unparalleled simplicity
                                    </div>
                                    <div className="md:text-base text-xs font-normal">
                                        We believe that the best solutions are the simplest ones. Our approach to loyalty program design is all about user-friendly simplicity. Our clients will effortlessly understand and participate in your loyalty initiatives, ensuring a seamless and enjoyable experience.
                                    </div>
                                </section>
                            </div>

                            <div className="why-us-3 flex items-center md:gap-16 sm:gap-10 gap-4">
                                <section className="left-side">
                                    <UserThinkingIcon1 width={100} height={100} customCSS={"md:min-w-[100px] md:h-auto min-w-[63px] minh-[63px]"} />
                                </section>

                                <section className="right-side">
                                    <div className={`${playfairDisplayFont.className} font-bold heading capitalize md:text-xl text-sm md:mb-4 mb-2`}>
                                        gamification that engages
                                    </div>
                                    <div className="md:text-base text-xs font-normal">
                                        We understand that today`s clients seek more than just rewards; they crave experiences. Our gamified loyalty programs inject fun and excitement, turning ordinary transactions into thrilling adventures. Engage your customers like never before and keep them coming back for more.
                                    </div>
                                </section>
                            </div>
                        </section>
                    </section>
                </section>

                {!isSessionExist &&
                    <section className="max-width max-w-screen-xl m-auto flex flex-col px-4 py-8">
                        <section className="subscribe-now-section bg-[url('/images/AboutUsImages/about-us-bg-image-1.png')] bg-cover bg-no-repeat h-[255px] rounded-3xl drop-shadow-lg bg-center relative">
                            <section className="information-section max-w-[800px] md:px-20 sm:px-10 px-4 absolute top-1/2 -translate-y-1/2">
                                <div className={`${roxboroughcfFont.className} font-normal heading capitalize md:text-5xl text-3xl`}>join us</div>
                                <div className="description md:my-4 my-2 md:text-base text-sm font-normal">
                                    We invite you to join us on this journey to transform your business through the power of loyalty. Together, we`ll enjoy loyalty programs that not only meet but exceed your expectations, helping you build stronger, more profitable relationships with your customers
                                </div>
                                <div onClick={() => { setShowSignInScene(true); setshowRegisterScene(true); }} className="button">
                                    <ButtonComponent1 middleSide={'subscribe now'} customButtonCSS={`!m-0 md:text-base sm:text-sm text-xs ${truenoRegular.className} cursor-pointer`} />
                                </div>
                            </section>
                        </section>
                    </section>
                }
            </section>

            {(showSignInScene || showRegisterScene) &&
                <LoginRegisterPopUp onClick={resetSceneState} />
            }
        </>
    );
};

export default CommunityPage;