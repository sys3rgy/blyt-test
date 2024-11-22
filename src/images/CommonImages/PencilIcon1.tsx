import Image from 'next/image';
import React from 'react';

interface PencilIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const PencilIcon1: React.FC<PencilIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/pencil-icon-1.png" alt="pencil-icon-2" />
        </>
    );
};

export default PencilIcon1;