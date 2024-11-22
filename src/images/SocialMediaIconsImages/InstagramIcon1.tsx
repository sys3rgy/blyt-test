import Image from 'next/image';
import React from 'react';

interface InstagramIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const InstagramIcon1: React.FC<InstagramIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/SocialMediaIcons/instagram-icon-1.png" alt="instagram-icon-1" />
        </>
    );
};
export default InstagramIcon1;