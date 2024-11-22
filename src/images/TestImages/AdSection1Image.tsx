import Image from 'next/image';
import React from 'react';

interface AdSection1ImageProps {
    width: number;
    height: number;
    customCSS: string;
}


const AdSection1Image: React.FC<AdSection1ImageProps> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TestImages/ad-section-1-text-image.png" alt="ad-section-1-text-image" />
        </>
    );
};
export default AdSection1Image;