import Image from 'next/image';
import React from 'react';

interface ImageUploadIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const ImageUploadIcon1: React.FC<ImageUploadIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/image-upload-icon-1.png" alt="image-upload-icon-1" />
        </>
    );
};

export default ImageUploadIcon1;