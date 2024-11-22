import Image from 'next/image';
import React from 'react';

interface UserThinkingIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const UserThinkingIcon1: React.FC<UserThinkingIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/user-thinking-icon-1.png" alt="user-thinking-icon-1" />
        </>
    );
};

export default UserThinkingIcon1;