import Image from 'next/image';
import React from 'react';

interface LikesIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const LikesIcon1: React.FC<LikesIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/likes-icon-1.png" alt="likes-icon-1" />
        </>
    );
};

export default LikesIcon1;