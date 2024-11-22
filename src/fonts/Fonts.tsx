// All Fonts Here
import { Poppins, Inter, Playfair_Display } from 'next/font/google'
import RoxboroughCF from 'next/font/local'
import Trueno from 'next/font/local'

export const poppinsFont = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal'],
    subsets: ['latin'],
})

export const playfairDisplayFont = Playfair_Display({
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal'],
    subsets: ['latin'],
})

export const interFont = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal'],
    subsets: ['latin'],
})

export const roxboroughcfFont = RoxboroughCF({
    src: '../../public/fonts/Roxborough-CF.ttf',
    display: 'swap',
})


const truenoRegular = Trueno({
    src: '../../public/fonts/Trueno-Regular.otf',
    display: 'swap',
});

const truenoBold = Trueno({
    src: '../../public/fonts/Trueno-Bold.otf',
    display: 'swap',
});

export { truenoRegular, truenoBold }; 