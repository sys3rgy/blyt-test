import Image from 'next/image';
import React from 'react';

interface PDFIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const PDFIcon1: React.FC<PDFIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/pdf-icon-1.png" alt="pdf-icon-1" />
        </>
    );
};

export default PDFIcon1;