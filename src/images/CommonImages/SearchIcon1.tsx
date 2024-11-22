import Image from 'next/image';
import React from 'react';

interface SearchIcon1Props {
    width: number;
    height: number;
    customCSS: string;
}


const SearchIcon1: React.FC<SearchIcon1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/CommonImages/search-icon-1.png" alt="search-icon" />
        </>
    );
};

export default SearchIcon1;