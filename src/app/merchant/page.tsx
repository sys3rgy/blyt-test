'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ErrorPage: React.FC = () => {

    const router = useRouter();

    useEffect(() => {
        router.push('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
        </>
    );
};

export default ErrorPage;