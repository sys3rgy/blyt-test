import Image from 'next/image';
import React from 'react';

interface ArrowsInsideBigArrowIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const ArrowsInsideBigArrowIcon1: React.FC<ArrowsInsideBigArrowIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/arrows-inside-big-arrow-icon-1.png" alt="arrows-inside-big-arrow-icon-1" />
        </>
    );
};

export default ArrowsInsideBigArrowIcon1;