import Image from 'next/image';
import React from 'react';

interface VerifiedIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const VerifiedIcon1: React.FC<VerifiedIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/verified-icon-1.png" alt="verified-icon-1" />
        </>
    );
};

export default VerifiedIcon1;