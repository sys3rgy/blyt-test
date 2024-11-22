import Image from 'next/image';
import React from 'react';

interface GetYourFundingNowImageProps {
    width: number;
    height: number;
    customCSS: string;
}


const GetYourFundingNowImage: React.FC<GetYourFundingNowImageProps> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommunityImages/get-your-funding-now.png" alt="get-your-funding-now" />
        </>
    );
};

export default GetYourFundingNowImage;