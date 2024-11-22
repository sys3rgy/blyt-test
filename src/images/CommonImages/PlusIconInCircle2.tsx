import Image from 'next/image';
import React from 'react';

interface PlusIconInCircle2Props {
    width: number;
    height: number;
    customCSS: string;
}


const PlusIconInCircle2: React.FC<PlusIconInCircle2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/plus-icon-in-circle-2.png" alt="plus-icon-in-circle-2" />
        </>
    );
};

export default PlusIconInCircle2;