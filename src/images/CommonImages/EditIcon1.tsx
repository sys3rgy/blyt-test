import Image from 'next/image';
import React from 'react';

interface EditIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const EditIcon1: React.FC<EditIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/edit-icon-1.png" alt="edit-icon-1" />
        </>
    );
};

export default EditIcon1;