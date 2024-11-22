import Image from 'next/image';
import React from 'react';

interface SignInUpPhoneIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpPhoneIcon1: React.FC<SignInUpPhoneIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/phone-icon-1.png" alt="phone-icon-1" />
        </>
    );
};
export default SignInUpPhoneIcon1;