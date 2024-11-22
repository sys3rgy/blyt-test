import Image from 'next/image';
import React from 'react';

interface IntroLine1Props {
    width: number;
    height: number;
    customCSS: string;
}


const IntroLine1: React.FC<IntroLine1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/intro-line-1.png" alt="intro-line-1" />
        </>
    );
};

export default IntroLine1;