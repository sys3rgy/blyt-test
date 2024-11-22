'use client'

import Typewriter from 'typewriter-effect';

const TypeWriterEffect1Component = () => {
    return (
        <Typewriter
            options={{
                strings: ['loyal customers', 'website', 'tribe', 'connections', 'empire', 'business', 'wealth'],
                autoStart: true,
                loop: true,
            }}
        />
    )
}

export default TypeWriterEffect1Component