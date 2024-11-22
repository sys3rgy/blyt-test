import Image from 'next/image';
import React from 'react';

interface SignInAndSignUpIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInAndSignUpIcon2: React.FC<SignInAndSignUpIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/icon-2.png" alt="icon-2" />
        </>
    );
};
export default SignInAndSignUpIcon2;