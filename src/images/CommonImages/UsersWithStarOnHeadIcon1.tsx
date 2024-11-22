import Image from 'next/image';
import React from 'react';

interface UsersWithStarOnHeadIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const UsersWithStarOnHeadIcon1: React.FC<UsersWithStarOnHeadIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/users-with-stars-on-head-icon-1.png" alt="users-with-stars-on-head-icon-1" />
        </>
    );
};

export default UsersWithStarOnHeadIcon1;