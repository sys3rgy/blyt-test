import Image from 'next/image';
import React from 'react';

interface LocationIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const LocationIcon2: React.FC<LocationIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/location-icon-2.png" alt="location-icon-2" />
        </>
    );
};

export default LocationIcon2;