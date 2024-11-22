import Image from 'next/image';
import React from 'react';

interface CurrencyIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const CurrencyIcon1: React.FC<CurrencyIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/currency-icon-1.png" alt="currency-icon-1" />
        </>
    );
};

export default CurrencyIcon1;