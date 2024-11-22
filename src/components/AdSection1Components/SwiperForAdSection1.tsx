'use client'

import { AdSection1ImageProps } from "@/images/ImagesExport";
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation, Pagination } from 'swiper/modules';

const SwiperForAdSection1: React.FC = () => {
    return (
        <>
            <div className="flex justify-center md:pt-16 pt-8 max-w-screen-xl m-auto">
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                    }}
                    navigation={true}
                    modules={[Navigation, Pagination]}
                    className="swiperForAdSection1"
                >
                    <SwiperSlide className="px-6"><AdSection1ImageProps width={1197} height={307} customCSS={""} /></SwiperSlide>
                    <SwiperSlide className="px-6"><AdSection1ImageProps width={1197} height={307} customCSS={""} /></SwiperSlide>
                    <SwiperSlide className="px-6"><AdSection1ImageProps width={1197} height={307} customCSS={""} /></SwiperSlide>
                    <SwiperSlide className="px-6"><AdSection1ImageProps width={1197} height={307} customCSS={""} /></SwiperSlide>
                    <SwiperSlide className="px-6"><AdSection1ImageProps width={1197} height={307} customCSS={""} /></SwiperSlide>
                    <SwiperSlide className="px-6"><AdSection1ImageProps width={1197} height={307} customCSS={""} /></SwiperSlide>
                </Swiper>
            </div>
        </>
    )
};

export default SwiperForAdSection1;
