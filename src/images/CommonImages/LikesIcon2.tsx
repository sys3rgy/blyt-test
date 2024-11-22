import Image from 'next/image';
import React from 'react';

interface LikesIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const LikesIcon2: React.FC<LikesIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/likes-icon-2.png" alt="likes-icon-2" />
        </>
    );
};

export default LikesIcon2;