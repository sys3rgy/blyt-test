import Image from 'next/image';
import React from 'react';

interface TopTribeIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TopTribeIcon1: React.FC<TopTribeIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TableImages/top-tribe-icon-1.png" alt="top-tribe-icon-1" />
        </>
    );
};

export default TopTribeIcon1;