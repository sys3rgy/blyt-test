import Image from 'next/image';
import React from 'react';

interface PDFUploadIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const PDFUploadIcon1: React.FC<PDFUploadIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/pdf-upload-icon-1.png" alt="pdf-upload-icon-1" />
        </>
    );
};

export default PDFUploadIcon1;