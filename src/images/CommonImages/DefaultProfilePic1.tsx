import Image from 'next/image';
import React from 'react';

interface DefaultProfilePic1Props {
    width: number;
    height: number;
    customCSS: string;
}


const DefaultProfilePic1: React.FC<DefaultProfilePic1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/default-profile-pic-1.png" alt="default-profile-pic-1" />
        </>
    );
};

export default DefaultProfilePic1;