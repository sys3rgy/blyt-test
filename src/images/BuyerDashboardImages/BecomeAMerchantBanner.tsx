import Image from 'next/image';
import React from 'react';

interface BecomeAMerchantBannerProps {
    width: number;
    height: number;
    customCSS: string;
}


const BecomeAMerchantBanner: React.FC<BecomeAMerchantBannerProps> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/BuyerDashboardImages/become-a-merchant-banner.png" alt="become-a-merchant-banner" />
        </>
    );
};

export default BecomeAMerchantBanner;