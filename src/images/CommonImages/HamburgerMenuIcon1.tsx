import Image from 'next/image';
import React from 'react';

interface HamburgerMenuIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const HamburgerMenuIcon1: React.FC<HamburgerMenuIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/hamburger-icon-1.png" alt="hamburger-icon" />
        </>
    );
};

export default HamburgerMenuIcon1;