import Image from 'next/image';
import React from 'react';

interface VerificationImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const VerificationImage1: React.FC<VerificationImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/verification-image-1.png" alt="verification-image-1" />
        </>
    );
};

export default VerificationImage1;