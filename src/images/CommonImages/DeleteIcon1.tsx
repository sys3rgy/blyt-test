import Image from 'next/image';
import React from 'react';

interface DeleteIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const DeleteIcon1: React.FC<DeleteIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/delete-icon-1.png" alt="delete-icon-1" />
        </>
    );
};

export default DeleteIcon1;