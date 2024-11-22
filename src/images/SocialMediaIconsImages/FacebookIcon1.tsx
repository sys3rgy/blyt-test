import Image from 'next/image';
import React from 'react';

interface FacebookIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const FacebookIcon1: React.FC<FacebookIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/SocialMediaIcons/facebook-icon-1.png" alt="facebook-icon-1" />
        </>
    );
};
export default FacebookIcon1;