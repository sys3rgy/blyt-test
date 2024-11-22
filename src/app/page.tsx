'use client'

import StatsDisplayComponent from "@/components/AboutBLYTComponents/StatsDisplayComponent";
import SwiperForAdSection1 from "@/components/AdSection1Components/SwiperForAdSection1";
import ButtonComponent1 from "@/components/CommonComponents/ButtonComponent1";
import HeadingComponent1 from "@/components/CommonComponents/HeadingComponent1";
import CommunityBoxComponent from "@/components/CommunityComponents/CommunityBoxComponent";
import FeaturedServiceBox from "@/components/FeaturedServicesComponents/FeaturedServiceBox";
import TypeWriterEffect1Component from "@/components/LadingPageComponents/TypeWriterEffect1Component";
import ReviewsSliderBarComponent from "@/components/Testimonials&ReviewsComponent/ReviewsSliderBarComponent";
import { DataContext } from "@/context/DataContext";
import { poppinsFont, roxboroughcfFont } from "@/fonts/Fonts";
import BuildYourTribeImage from "@/images/CommunityImages/BuildYourTribeImage";
import ForumImage from "@/images/CommunityImages/ForumImage";
import GetYourFundingNowImage from "@/images/CommunityImages/GetYourFundingNowImage";
import UpcomingEventsImage from "@/images/CommunityImages/UpcomingEventsImage";
import { AdSection2Image1, AdSection2Image2, BizzPointsGiven1, BusinessConnectImage1, DoneDealsImage1, IntroLine1, PlusIconInCircle1, TopGiverIcon1, TopReferrerIcon1, TopSharerIcon1, TopTribeIcon1, TrustedByImage1 } from "@/images/ImagesExport";
import IntroImage1 from "@/images/IntroImages/IntroImage1";
import LeaderboardTableLayout from "@/layouts/LeaderboardTableLayout";
import LoginRegisterPopUp from "@/layouts/LoginRegisterPopUp";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Home() {

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
        {/* Intro Sectin */}
        <section className="intro-section bg-[#9F885E] bg-opacity-20 text-black relative">

          <div className="max-width flex lg:flex-row flex-col justify-evenly items-center lg:gap-1 gap-4 px-4 py-8">

            <section className="left-side lg:h-[55vh] h-auto flex flex-col justify-center z-50 whitespace-nowrap lg:min-w-[460px] min-w-[343px]">
              <p className={`${roxboroughcfFont.className} font-bold line-1 capitalize sm:text-5xl text-3xl sm:mb-6 mb-2`}>
                welcome to <span className="uppercase">blyt</span>
              </p>

              <p className="image-1 sm:mb-6 mb-2">
                <IntroLine1 width={430} height={1} customCSS={"sm:w-[430px] w-[200px]"} />
              </p>

              <p className={`${poppinsFont.className} font-medium line-2 capitalize text-[#3C515D] sm:text-4xl text-xl sm:mb-20 mb-4`}>
                business loyalty for all
              </p>

              <section className="line-3 capitalize sm:text-3xl text-xl">
                <span className={`${poppinsFont.className} font-light sm:text-3xl text-xl font-ight flex gap-2 text-black`}>
                  build your
                  <span className={`${poppinsFont.className} font-bold text-lightGold uppercase text-[#9F885E]`}>
                    <TypeWriterEffect1Component />
                  </span>
                </span>
              </section>
            </section>

            <section className="right-side lg:pl-0">
              <IntroImage1 width={747} height={338} customCSS={""} />
            </section>

          </div>
        </section>

        {/* Ad Section 1 */}
        <SwiperForAdSection1 />

        {/* Featured Services Section */}
        <section className="fetaures-services-section md:pt-16 pt-8 px-4">
          <div className="max-width max-w-screen-xl m-auto">
            <HeadingComponent1 title={"featured services"} lineWidth={"w-[120%]"} showRightSide={true} />

            <div className="features-services-list grid xl:grid-cols-4 grid-cols-2 sm:gap-[49.6px] gap-4 justify-items-center">
              <FeaturedServiceBox backgroundImage={"/images/TestImages/feature-services-test-image-1.png"} companyLogo={"/images/TestImages/feature-services-test-logo-1.png"} companyName={"Company Name"} companycategory={"Company Category"} />
              <FeaturedServiceBox backgroundImage={"/images/TestImages/feature-services-test-image-1.png"} companyLogo={"/images/TestImages/feature-services-test-logo-1.png"} companyName={"Company Name"} companycategory={"Company Category"} />
              <FeaturedServiceBox backgroundImage={"/images/TestImages/feature-services-test-image-1.png"} companyLogo={"/images/TestImages/feature-services-test-logo-1.png"} companyName={"Company Name"} companycategory={"Company Category"} />
              <FeaturedServiceBox backgroundImage={"/images/TestImages/feature-services-test-image-1.png"} companyLogo={"/images/TestImages/feature-services-test-logo-1.png"} companyName={"Company Name"} companycategory={"Company Category"} />
            </div>
          </div>
        </section>

        {/* Leaderboard Table Section */}
        <section className="leaderboard-table md:pt-16 pt-8 px-4">
          <div className="max-width max-w-screen-xl m-auto">
            <HeadingComponent1 title={"leaderboard"} lineWidth={"w-[120%]"} showRightSide={false} />

            <section className="leaderboard-body flex lg:flex-row flex-col justify-between lg:gap-56 gap-0">

              <section className="left-side px-2 w-full">
                <div className="flex flex-wrap gap-2">
                  <ButtonComponent1 customButtonCSS={`!font-bold md:text-base text-xs h-[41px]`} leftSide={<TopGiverIcon1 width={40} height={30} customCSS={""} />} middleSide={'top giver'} />
                  <ButtonComponent1 customButtonCSS={`!font-bold md:text-base text-xs`} leftSide={<TopReferrerIcon1 width={25} height={25} customCSS={""} />} middleSide={'top referrer'} />
                  <ButtonComponent1 customButtonCSS={`!font-bold md:text-base text-xs`} leftSide={<TopSharerIcon1 width={25} height={25} customCSS={""} />} middleSide={'top sharer'} />
                  {/* <ButtonComponent1 customButtonCSS={`!font-bold md:text-base text-xs`} leftSide={<TopTribeIcon1 width={25} height={25} customCSS={""} />} middleSide={'top tribe'} /> */}
                </div>

                <LeaderboardTableLayout />
              </section>

              <Link href={'/purchase-points'} className="right-side relative lg:m-0 m-auto lg:mt-0 mt-8 cursor-pointer">
                <Image width={361} height={424} className="lg:min-w-[361px] min-w-[300px] h-full" src="/images/TableImages/test-1.png" alt="" />

                {/* <ButtonComponent1
                  middleSide={'see more'}
                  customSectionCSS={"absolute bottom-[60px] left-1/2 -translate-x-1/2"}
                /> */}
              </Link>
            </section>

          </div>
        </section>

        {/* About BLYT Section */}
        <section className="about-blyt-section md:pt-16 pt-8 px-4">
          <div className="max-width max-w-screen-xl m-auto">
            <section className="blyt-status-section lg:flex justify-between grid sm:grid-cols-2 grid-cols-1 lg:gap-0 gap-4">

              <StatsDisplayComponent image={<TrustedByImage1 width={85} height={70} customCSS={""} />} title1={"trusted by"} title2={"100+ buzinesses"} />

              <p className="border border-red-900 opacity-50 lg:block hidden"></p>

              <StatsDisplayComponent image={<DoneDealsImage1 width={85} height={70} customCSS={""} />} title1={"done deals"} title2={"1mn$ +"} />

              <p className="border border-red-900 opacity-50 lg:block hidden"></p>

              <StatsDisplayComponent image={<BizzPointsGiven1 width={85} height={70} customCSS={""} />} title1={"bizz points given"} title2={"20000+"} />

              <p className="border border-red-900 opacity-50 lg:block hidden"></p>

              <StatsDisplayComponent image={<BusinessConnectImage1 width={85} height={70} customCSS={""} />} title1={"business connected"} title2={"10000+"} />

            </section>
          </div>
        </section>

        {!isSessionExist &&
          <section className={`${poppinsFont.className} join-us-banner-section-for-desktop-tablet-mobile md:pt-16 pt-8 px-4`}>
            <div className="max-width max-w-screen-xl m-auto relative drop-shadow-lg teeny:bg-[url('/images/AboutBLYTImages/join-us-desktop-tablet-banner.png')] bg-[url('/images/AboutBLYTImages/join-us-mobile-banner.png')] bg-[length:100%_100%] md:h-[312px] teeny:h-[200px] h-[604px] bg-no-repeat">
              <div className="in-image-text absolute teeny:top-1/2 top-[65%] teeny:left-[30%] left-[50%] teeny:-translate-x-[40%] -translate-x-[50%] teeny:-translate-y-1/2 teeny:text-left text-center !min-w-[310px]">
                <p className={`${roxboroughcfFont.className} font-bold md:text-5xl text-3xl capitalize`}>you <span className="text-[#3C515D]">ask</span> we <span className="text-[#3C515D]">provide.</span></p>
                <p className="font-light md:my-6 teeny:my-2 mt-4 mb-6 md:text-base text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus maximus diam sapien.</p>
                <div onClick={() => { setShowSignInScene(true); setshowRegisterScene(true); }} className="flex teeny:justify-start justify-center font-semibold">
                  <ButtonComponent1 leftSide={""} middleSide={"join us"} rightSide={""} customButtonCSS={"text-xs !px-14 !py-4 cursor-pointer"} customSectionCSS={""} />
                </div>
              </div>
            </div>
          </section>
        }

        {/* Testimonials & Reviews Section */}
        <section className="testimonials-&-reviews-section md:pt-16 pt-8 px-4">
          <div className="max-width max-w-screen-xl m-auto">
            <HeadingComponent1 title={"testimonials & reviews"} lineWidth={"w-[120%]"} showRightSide={false} />
            <ReviewsSliderBarComponent />
          </div>
        </section>

        {/* Ad Section 2 */}
        <section className="ad-section-2 md:pt-16 pt-8 px-4">
          <div className="max-width max-w-screen-xl m-auto flex md:flex-row flex-col md:justify-between justify-center gap-8">
            <div className="left-side md:m-0 m-auto">
              <AdSection2Image1 width={354} height={427} customCSS={"rounded-lg"} />
            </div>
            <div className="right-side flex flex-col justify-between gap-8">
              <AdSection2Image2 width={745} height={191} customCSS={"rounded-lg"} />
              <AdSection2Image2 width={745} height={191} customCSS={"rounded-lg"} />
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="community-section">
          <div className="absolute -z-10">
            <Image className="lg:h-[840px] sm:h-[1550px] h-[1000px]" width={1440} height={850} src="/images/CommunityImages/community-bg-image.png" alt="" />
          </div>
          <div className="max-width max-w-screen-xl m-auto md:pt-16 pt-8 md:mb-0 mb-8 px-4">
            <HeadingComponent1 title={"community"} lineWidth={"w-[120%]"} showRightSide={false} />
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
              <CommunityBoxComponent
                imageForDesktop={<BuildYourTribeImage width={265} height={298} customCSS={""} />}
                imageForMobile={<BuildYourTribeImage
                  width={167}
                  height={187}
                  customCSS={""} />}
                imagePositionForDesktop={"sm:-top-[42px] -top-[9px]"}
                title={"build your tribe"}
                description={"Build your tribe with us, form your super team, lets go far together! "} />

              <CommunityBoxComponent
                imageForDesktop={<UpcomingEventsImage
                  width={265}
                  height={298}
                  customCSS={""} />}
                imageForMobile={<UpcomingEventsImage
                  width={167}
                  height={187}
                  customCSS={""} />}
                imagePositionForDesktop={"sm:-top-[42px] -top-[9px]"}
                title={"upcoming events"}
                description={"Create meaningul events with us, meet more business like minded friends, network for our net worth. "} />

              <CommunityBoxComponent
                imageForDesktop={<ForumImage width={265}
                  height={298}
                  customCSS={""} />}
                imageForMobile={<ForumImage width={167}
                  height={187}
                  customCSS={""} />}
                imagePositionForDesktop={"sm:-top-[40px] -top-[7px]"}
                title={"forum"}
                description={"Share your questions and needs here, we'd love to help each other. "} />

              <CommunityBoxComponent
                imageForDesktop={<GetYourFundingNowImage
                  width={265}
                  height={298}
                  customCSS={""} />}
                imageForMobile={<GetYourFundingNowImage
                  width={167}
                  height={197}
                  customCSS={""} />}
                imagePositionForDesktop={"sm:-top-[38px] -top-[8px]"}
                title={"get your funding now!"}
                description={"Let our investors know how great is your business, and how can they invest in you for further success!"} />

            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="future-roadmap-section md:pt-32 pt-8">
          <div className="px-4"><HeadingComponent1 title={"future roadmap"} lineWidth={"w-[120%]"} showRightSide={false} /></div>
          <div className="md:block hidden w-auto h-auto"> <Image width={2000} height={2000} src="/images/FutureRoadmapImages/roadmap-desktop.png" alt="" /> </div>
          <div className="md:hidden block w-auto h-auto"> <Image width={1440} height={1440} src="/images/FutureRoadmapImages/roadmap-mobile.png" alt="" /> </div>
        </section>
      </section>

      {(showSignInScene || showRegisterScene) &&
        <LoginRegisterPopUp onClick={resetSceneState} />
      }
    </>
  )
}