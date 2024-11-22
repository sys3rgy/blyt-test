import Image from 'next/image';
import React from 'react';

interface TestimonialsImage1Props {
    width: number;
    height: number;
    customCSS: string;
}


const TestimonialsImage1: React.FC<TestimonialsImage1Props> = ({ customCSS, width, height }) => {
    return (
        <>
            <Image className={`${customCSS}`} width={width} height={height} src="/images/TestImages/testimonials-test-image-1.png" alt="testimonials-test-image-1" />
        </>
    );
};

export default TestimonialsImage1;