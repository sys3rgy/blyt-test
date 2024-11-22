import Image from 'next/image';
import React from 'react';

interface CrossIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const CrossIcon1: React.FC<CrossIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS} cursor-pointer`} width={width} height={height} src="/images/CommonImages/cross-icon-1.png" alt="cross-icon-1" />
        </>
    );
};

export default CrossIcon1;