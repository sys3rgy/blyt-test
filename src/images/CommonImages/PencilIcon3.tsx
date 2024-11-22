import Image from 'next/image';
import React from 'react';

interface PencilIcon3Props {
    width: number;
    height: number;
    customCSS: string;
}


const PencilIcon3: React.FC<PencilIcon3Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/pencil-icon-3.png" alt="pencil-icon-3" />
        </>
    );
};

export default PencilIcon3;