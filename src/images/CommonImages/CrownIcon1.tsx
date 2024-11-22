import Image from 'next/image';
import React from 'react';

interface CrownIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const CrownIcon1: React.FC<CrownIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/crown-icon-1.png" alt="crown-icon-1" />
        </>
    );
};

export default CrownIcon1;