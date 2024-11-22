import Image from 'next/image';
import React from 'react';

interface LinkedinIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const LinkedinIcon1: React.FC<LinkedinIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/SocialMediaIcons/linkedin-icon-1.png" alt="linkedin-icon-1" />
        </>
    );
};
export default LinkedinIcon1;