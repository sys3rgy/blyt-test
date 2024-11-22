import Image from 'next/image';
import React from 'react';

interface AdSection2Image2Props {
    width: number;
    height: number;
    customCSS: string;
}


const AdSection2Image2: React.FC<AdSection2Image2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TestImages/ad-section-2-image-2.png" alt="ad-section-2-image-1" />
        </>
    );
};
export default AdSection2Image2;