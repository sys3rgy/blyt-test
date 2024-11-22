import { FacebookIcon1, LinkedinIcon1, TwitterIcon1 } from '@/images/ImagesExport';
import Link from 'next/link';
import React, { FC } from 'react';

interface SocialMediaShareButtonProps {
    url: string;
    title: string;
    socialMedia: string;
}

const SocialMediaShareButton: FC<SocialMediaShareButtonProps> = ({ url, title, socialMedia }) => {
    return (
        <div className='flex gap-10'>
            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <FacebookIcon1 width={96} height={96} customCSS={''} />
            </Link>

            <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon1 width={96} height={96} customCSS={''} />
            </Link>

            <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                <TwitterIcon1 width={96} height={96} customCSS={''} />
            </Link>
        </div>
    );
};

export default SocialMediaShareButton;