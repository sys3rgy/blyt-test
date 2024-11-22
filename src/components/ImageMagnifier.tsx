import React, { useRef, useState } from 'react';
import Image from 'next/image';

const ImageMagnifier: React.FC<{ src: string }> = ({ src }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const magnifierRef = useRef<HTMLDivElement>(null);
    const [isMagnified, setIsMagnified] = useState(false);

    const handleImageClick = () => {
        setIsMagnified(true);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsMagnified(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} className='relative'>
            <Image className='rounded-xl drop-shadow-lg' src={src} alt="Product" width={1000} height={1000} onClick={handleImageClick} unoptimized={true} />
            {isMagnified && (
                <div
                    ref={magnifierRef}
                    className='fixed md:block hidden top-1/2 left left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-[1000px] lg:w-[1000px] w-[700px]'
                >
                    <Image className='rounded-xl drop-shadow-lg' src={src} width={1000} height={1000} alt="Product" unoptimized={true} />
                </div>
            )}
        </div>
    );
};

export default ImageMagnifier;
