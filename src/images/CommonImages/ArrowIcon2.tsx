import Image from 'next/image';
import React from 'react';

interface ArrowIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const ArrowIcon2: React.FC<ArrowIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/arrow-icon-2.png" alt="arrow-icon-2" />
        </>
    );
};

export default ArrowIcon2;