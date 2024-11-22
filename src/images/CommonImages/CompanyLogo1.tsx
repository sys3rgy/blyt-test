import Image from 'next/image';
import React from 'react';

interface CompanyLogo1Props {
    width: number;
    height: number;
    customCSS: string;
}


const CompanyLogo1: React.FC<CompanyLogo1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/company-logo-1.png" alt="blyt-logo" priority />
        </>
    );
};

export default CompanyLogo1;