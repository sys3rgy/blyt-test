import Image from 'next/image';
import React from 'react';

interface CopyIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const CopyIcon1: React.FC<CopyIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/copy-icon-1.png" alt="copy-icon-1" />
        </>
    );
};

export default CopyIcon1;