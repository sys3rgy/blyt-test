import Image from 'next/image';
import React from 'react';

interface SignInUpPasswordIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpPasswordIcon1: React.FC<SignInUpPasswordIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/password-icon-1.png" alt="password-icon-1" />
        </>
    );
};
export default SignInUpPasswordIcon1;