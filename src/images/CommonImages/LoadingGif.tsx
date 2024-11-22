import Image from 'next/image';
import React from 'react';

interface LoadingGifProps {
    width: number;
    height: number;
}

const LoadingGif: React.FC<LoadingGifProps> = ({ width, height }) => {
    return (
        <>
            <Image width={width} height={height} src="/images/CommonImages/loading.svg" alt="loading" priority />
        </>
    );
};

export default LoadingGif;