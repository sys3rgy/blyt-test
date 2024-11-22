import Image from 'next/image';
import React from 'react';

interface NoImageIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const NoImageIcon1: React.FC<NoImageIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/no-image-icon-1.png" alt="no-image-icon-1" />
        </>
    );
};

export default NoImageIcon1;