import Image from 'next/image';
import React from 'react';

interface IntroImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const IntroImage1: React.FC<IntroImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/IntroImages/intro-image-1.png" alt="intro-image-1" />
        </>
    );
};

export default IntroImage1;