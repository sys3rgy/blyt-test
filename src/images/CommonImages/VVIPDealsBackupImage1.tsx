import Image from 'next/image';
import React from 'react';

interface VVIPDealsBackupImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const VVIPDealsBackupImage1: React.FC<VVIPDealsBackupImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/vvip-deals-backup-image-1.png" alt="vvip-deals-backup-image-1" />
        </>
    );
};

export default VVIPDealsBackupImage1;