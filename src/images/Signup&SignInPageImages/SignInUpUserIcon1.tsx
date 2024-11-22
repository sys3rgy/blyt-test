import Image from 'next/image';
import React from 'react';

interface SignInUpUserIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpUserIcon1: React.FC<SignInUpUserIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/user-icon-1.png" alt="user-icon-1" />
        </>
    );
};
export default SignInUpUserIcon1;