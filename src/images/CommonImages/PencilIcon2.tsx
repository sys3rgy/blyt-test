import Image from 'next/image';
import React from 'react';

interface PencilIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const PencilIcon2: React.FC<PencilIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/pencil-icon-2.png" alt="pencil-icon-2" />
        </>
    );
};

export default PencilIcon2;