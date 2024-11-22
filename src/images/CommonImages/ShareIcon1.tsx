import Image from 'next/image';
import React from 'react';

interface ShareIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const ShareIcon1: React.FC<ShareIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/share-icon-1.png" alt="share-icon-1" />
        </>
    );
};

export default ShareIcon1;