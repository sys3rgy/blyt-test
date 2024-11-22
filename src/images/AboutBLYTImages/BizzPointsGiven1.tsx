import Image from 'next/image';
import React from 'react';

interface BizzPointsGiven1Props {
    width: number;
    height: number;
    customCSS: string;
}


const BizzPointsGiven1: React.FC<BizzPointsGiven1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/AboutBLYTImages/bizz-points-given-1.png" alt="bizz-points-given-1" />
        </>
    );
};

export default BizzPointsGiven1;