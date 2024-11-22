'use client'

import { ReactNode } from "react"

interface InputComonentForSignInUpPage {
    title: string;
    customSectionCSS?: string;
    customTitleCSS?: string;
    image: ReactNode;
    inputType: string;
    placeholder?: string;
    value: string;
    onChange?: any;
    readonly?: boolean;
    inputName?: string;
    customInputCSS?: string;
}

const InputComonentForSignInUpPage: React.FC<InputComonentForSignInUpPage> = ({ customSectionCSS, title, customTitleCSS, image, inputType, placeholder, value, onChange, readonly, inputName, customInputCSS }) => {
    return (
        <>
            <section className={`${customSectionCSS} input-fields`}>
                <div className='relative'>
                    <p className={`${customTitleCSS} capitalize absolute -top-3 left-5 bg-[#F5F5F5] px-2 font-bold`}>{title}</p>
                    <p className='absolute top-1/2 -translate-y-1/2 left-2'>
                        {image}
                    </p>
                    <input placeholder={placeholder} value={value} onChange={onChange} name={inputName} className={`${customInputCSS} border border-black rounded-lg pl-8 py-3 w-full bg-transparent`} type={inputType} readOnly={readonly} />
                </div>
            </section>
        </>
    )
}

export default InputComonentForSignInUpPage