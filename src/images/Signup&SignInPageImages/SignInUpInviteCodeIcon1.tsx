import Image from 'next/image';
import React from 'react';

interface SignInUpInviteCodeIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SignInUpInviteCodeIcon1: React.FC<SignInUpInviteCodeIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/Signup&SignInPageImages/invite-code-1.png" alt="invite-code-1" />
        </>
    );
};
export default SignInUpInviteCodeIcon1;