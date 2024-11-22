import Image from 'next/image';
import React from 'react';

interface ForumImageProps {
    width: number;
    height: number;
    customCSS: string;
}


const ForumImage: React.FC<ForumImageProps> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommunityImages/forum.png" alt="forum" />
        </>
    );
};

export default ForumImage;