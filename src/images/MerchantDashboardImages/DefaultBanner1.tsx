import Image from 'next/image';
import React from 'react';

interface DefaultBanner1Props {
    width: number;
    height: number;
    customCSS: string;
}


const DefaultBanner1: React.FC<DefaultBanner1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/MerchantDashboardImages/default-banner-1.jpg" alt="default-banner-1" />
        </>
    );
};
export default DefaultBanner1;