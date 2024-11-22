import Image from 'next/image';
import React from 'react';

interface SecurityIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SecurityIcon1: React.FC<SecurityIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/security-icon-1.png" alt="user-icon" />
        </>
    );
};

export default SecurityIcon1;