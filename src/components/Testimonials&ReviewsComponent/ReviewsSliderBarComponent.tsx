'use client'

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import ReviewsBoxComponent from './ReviewsBoxComponent';

const ReviewsSliderBarComponent: React.FC = () => {
    return (
        <>
            <Swiper
                slidesPerView={1}
                spaceBetween={50}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    },
                }}
                className="swiperForReviewsSlicerComponent"
            >
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
                <SwiperSlide> <ReviewsBoxComponent /> </SwiperSlide>
            </Swiper>
        </>
    )
}

export default ReviewsSliderBarComponent