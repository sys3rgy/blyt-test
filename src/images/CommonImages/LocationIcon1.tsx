import Image from 'next/image';
import React from 'react';

interface LocationIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const LocationIcon1: React.FC<LocationIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/location-icon-1.png" alt="location-icon-1" />
        </>
    );
};

export default LocationIcon1;