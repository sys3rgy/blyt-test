import Image from 'next/image';
import React from 'react';

interface PlusIconInCircle1Props {
    width: number;
    height: number;
    customCSS: string;
}


const PlusIconInCircle1: React.FC<PlusIconInCircle1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/plus-icon-in-circle-1.png" alt="plus-icon-in-circle-1" />
        </>
    );
};

export default PlusIconInCircle1;