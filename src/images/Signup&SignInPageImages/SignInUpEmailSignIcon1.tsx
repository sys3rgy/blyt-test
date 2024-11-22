import Image from 'next/image';
import React from 'react';

interface SignInUpEmailSignIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpEmailSignIcon1: React.FC<SignInUpEmailSignIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/email-sign-icon-1.png" alt="email-sign-icon-1" />
        </>
    );
};
export default SignInUpEmailSignIcon1;