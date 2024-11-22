import Image from 'next/image';
import React from 'react';

interface TopSharerIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TopSharerIcon1: React.FC<TopSharerIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TableImages/top-sharer-icon-1.png" alt="top-sharer-icon-1" />
        </>
    );
};

export default TopSharerIcon1;