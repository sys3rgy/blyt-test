import React from 'react'
import ButtonComponent1 from '../CommonComponents/ButtonComponent1'
import Link from 'next/link'

const ResetPassowordButtonComponent: React.FC = () => {
    return (
        <Link href='/reset-password'>
            <ButtonComponent1
                middleSide={'forgot password'}
                customSectionCSS={"text-xs cursor-pointer"}
                customButtonCSS={"bg-transparent !text-black opacity-50 hover:opacity-100 transition-all duration-500 ease-in-out text-xs hover:text-base"} />
        </Link>
    )
}

export default ResetPassowordButtonComponent