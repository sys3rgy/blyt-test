import Image from 'next/image';
import React from 'react';

interface FeaturedServicesTestImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const FeaturedServicesTestImage1: React.FC<FeaturedServicesTestImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TestImages/feature-services-test-image-1.png" alt="feature-services-test-image-1" />
        </>
    );
};

export default FeaturedServicesTestImage1;