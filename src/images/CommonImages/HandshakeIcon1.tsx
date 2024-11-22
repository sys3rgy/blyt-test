import Image from 'next/image';
import React from 'react';

interface HandshakeIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const HandshakeIcon1: React.FC<HandshakeIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/handshake-icon-1.png" alt="handshake-icon-1" />
        </>
    );
};

export default HandshakeIcon1;