'use client'

// 'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Test = () => {
    const [searchTerm, setsearchTerm] = useState('');

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (searchTerm) {
            // Set a timer to execute fetchData after 1 second of inactivity
            timer = setTimeout(async () => {
                const response = await axios.post('/api/test/search', { searchTerm });
            }, 500);
        }

        // Clear the timer on each keystroke to reset the 1-second delay
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className='bg-black h-screen p-10'>
            <input
                type="text"
                className='w-full'
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
            />
        </div>
    );
};

export default Test;
