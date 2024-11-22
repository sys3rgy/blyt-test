import Image from 'next/image';
import React from 'react';

interface BuildYourTribeImageProps {
    width: number;
    height: number;
    customCSS: string;
}


const BuildYourTribeImage: React.FC<BuildYourTribeImageProps> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommunityImages/build-your-tribe.png" alt="build-your-tribe" />
        </>
    );
};

export default BuildYourTribeImage;