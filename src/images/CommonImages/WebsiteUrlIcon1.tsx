import Image from 'next/image';
import React from 'react';

interface WebsiteUrlIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const WebsiteUrlIcon1: React.FC<WebsiteUrlIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/website-url-icon-1.png" alt="website-url-icon-1" />
        </>
    );
};

export default WebsiteUrlIcon1;