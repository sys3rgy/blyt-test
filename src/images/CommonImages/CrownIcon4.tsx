import Image from 'next/image';
import React from 'react';

interface CrownIcon4Props {
    width: number;
    height: number;
    customCSS: string;
}


const CrownIcon4: React.FC<CrownIcon4Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/crown-icon-4.png" alt="crown-icon-4" />
        </>
    );
};

export default CrownIcon4;