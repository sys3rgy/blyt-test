import Image from 'next/image';
import React from 'react';

interface VideoUploadIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const VideoUploadIcon1: React.FC<VideoUploadIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/video-upload-icon-1.png" alt="video-upload-icon-1" />
        </>
    );
};

export default VideoUploadIcon1;