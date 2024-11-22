import Image from 'next/image';
import React from 'react';

interface UserIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const UserIcon1: React.FC<UserIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/user-icon-1.png" alt="user-icon" />
        </>
    );
};

export default UserIcon1;