import Image from 'next/image';
import React from 'react';

interface ArrowOnTarget1Props {
    width: number;
    height: number;
    customCSS: string;
}


const ArrowOnTarget1: React.FC<ArrowOnTarget1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/arrow-on-target-icon-1.png" alt="arrow-on-target-icon-1" />
        </>
    );
};

export default ArrowOnTarget1;