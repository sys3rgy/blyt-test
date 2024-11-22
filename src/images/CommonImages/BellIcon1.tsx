import Image from 'next/image';
import React from 'react';

interface BellIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const BellIcon1: React.FC<BellIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/bell-icon-1.png" alt="bell-icon" />
        </>
    );
};

export default BellIcon1;