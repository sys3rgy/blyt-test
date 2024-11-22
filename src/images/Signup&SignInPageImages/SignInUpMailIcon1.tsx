import Image from 'next/image';
import React from 'react';

interface SignInUpMailIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpMailIcon1: React.FC<SignInUpMailIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/mail-icon-1.png" alt="mail-icon-1" />
        </>
    );
};
export default SignInUpMailIcon1;