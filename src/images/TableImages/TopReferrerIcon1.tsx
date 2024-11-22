import Image from 'next/image';
import React from 'react';

interface TopReferrerIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TopReferrerIcon1: React.FC<TopReferrerIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TableImages/top-referrer-icon-1.png" alt="top-referrer-icon-1" />
        </>
    );
};

export default TopReferrerIcon1;