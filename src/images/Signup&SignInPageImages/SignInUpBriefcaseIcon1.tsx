import Image from 'next/image';
import React from 'react';

interface SignInUpBriefcaseIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpBriefcaseIcon1: React.FC<SignInUpBriefcaseIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/briefcase-icon-1.png" alt="briefcase-icon-1" />
        </>
    );
};
export default SignInUpBriefcaseIcon1;