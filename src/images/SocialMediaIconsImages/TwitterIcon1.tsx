import Image from 'next/image';
import React from 'react';

interface TwitterIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TwitterIcon1: React.FC<TwitterIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/SocialMediaIcons/twitter-icon-1.png" alt="twitter-icon-1" />
        </>
    );
};
export default TwitterIcon1;