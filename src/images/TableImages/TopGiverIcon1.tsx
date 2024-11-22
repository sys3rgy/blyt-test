import Image from 'next/image';
import React from 'react';

interface TopGiverIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TopGiverIcon1: React.FC<TopGiverIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TableImages/top-giver-icon-1.png" alt="top-giver-icon-1" />
        </>
    );
};

export default TopGiverIcon1;