import Image from 'next/image';
import React from 'react';

interface EditIcon2Props {
    width: number;
    height: number;
    customCSS: string;
}


const EditIcon2: React.FC<EditIcon2Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/edit-icon-2.png" alt="edit-icon-2" />
        </>
    );
};

export default EditIcon2;