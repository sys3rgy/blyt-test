import Image from 'next/image';
import React from 'react';

interface FeaturedServicesTestIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const FeaturedServicesTestIcon1: React.FC<FeaturedServicesTestIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TestImages/feature-services-test-logo-1.png" alt="feature-services-test-logo-1" />
        </>
    );
};

export default FeaturedServicesTestIcon1;