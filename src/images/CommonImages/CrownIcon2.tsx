import Image from 'next/image';
import React from 'react';

interface CrownIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const CrownIcon2: React.FC<CrownIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/crown-icon-2.png" alt="crown-icon-2" />
        </>
    );
};

export default CrownIcon2;