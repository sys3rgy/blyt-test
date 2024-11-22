import Image from 'next/image';
import React from 'react';

interface ArrowIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const ArrowIcon1: React.FC<ArrowIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/arrow-icon-1.png" alt="arrow-icon-1" />
        </>
    );
};

export default ArrowIcon1;