import Image from 'next/image';
import React from 'react';

interface StarIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const StarIcon2: React.FC<StarIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/star-icon-2.png" alt="star-icon-2" />
        </>
    );
};

export default StarIcon2;