import Image from 'next/image';
import React from 'react';

interface DoneDealsImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const DoneDealsImage1: React.FC<DoneDealsImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/AboutBLYTImages/done-deals-1.png" alt="done-deals-1" />
        </>
    );
};

export default DoneDealsImage1;