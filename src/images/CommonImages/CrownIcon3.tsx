import Image from 'next/image';
import React from 'react';

interface CrownIcon3Props {
    width: number;
    height: number;
    customCSS: string;
}


const CrownIcon3: React.FC<CrownIcon3Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/crown-icon-3.png" alt="crown-icon-3" />
        </>
    );
};

export default CrownIcon3;