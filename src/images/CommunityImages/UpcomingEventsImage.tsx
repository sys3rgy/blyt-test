import Image from 'next/image';
import React from 'react';

interface UpcomingEventsImageProps {
    width: number;
    height: number;
    customCSS: string;
}


const UpcomingEventsImage: React.FC<UpcomingEventsImageProps> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommunityImages/upcoming-events.png" alt="upcoming-events" />
        </>
    );
};

export default UpcomingEventsImage;