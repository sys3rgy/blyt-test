import Image from 'next/image';
import React from 'react';

interface SignInAndSignUpIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInAndSignUpIcon1: React.FC<SignInAndSignUpIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/icon-1.png" alt="icon-1" />
        </>
    );
};
export default SignInAndSignUpIcon1;