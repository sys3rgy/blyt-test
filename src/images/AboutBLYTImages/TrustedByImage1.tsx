import Image from 'next/image';
import React from 'react';

interface TrustedByImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TrustedByImage1: React.FC<TrustedByImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/AboutBLYTImages/business-connected-1.png" alt="business-connected-1" />
        </>
    );
};

export default TrustedByImage1;