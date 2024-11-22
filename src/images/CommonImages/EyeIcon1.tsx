import Image from 'next/image';
import React from 'react';

interface EyeIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const EyeIcon1: React.FC<EyeIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/eye-icon-1.png" alt="eye-icon-1" />
        </>
    );
};

export default EyeIcon1;