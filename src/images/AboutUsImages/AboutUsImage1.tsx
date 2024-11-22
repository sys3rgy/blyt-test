import Image from 'next/image';
import React from 'react';

interface AboutUsImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const AboutUsImage1: React.FC<AboutUsImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/AboutUsImages/about-us-image-1.png" alt="about-us-image-1" />
        </>
    );
};

export default AboutUsImage1;