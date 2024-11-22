import Image from 'next/image';
import React from 'react';

interface StarIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const StarIcon1: React.FC<StarIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/star-icon-1.png" alt="star-icon-1" />
        </>
    );
};

export default StarIcon1;