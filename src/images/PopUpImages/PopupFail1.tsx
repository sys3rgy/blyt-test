import Image from 'next/image';
import React from 'react';

interface PopupFail1Props {
    width: number;
    height: number;
    customCSS: string;
}


const PopupFail1: React.FC<PopupFail1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/PopUpComponents/popup-fail-1.png" alt="popup-fail-1" />
        </>
    );
};
export default PopupFail1;