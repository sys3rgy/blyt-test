import Image from 'next/image';
import React from 'react';

interface PopupSuccessImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const PopupSuccessImage1: React.FC<PopupSuccessImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/PopUpComponents/popup-success-1.png" alt="popup-success-1" unoptimized={true} />
        </>
    );
};
export default PopupSuccessImage1;