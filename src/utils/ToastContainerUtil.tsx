'use client'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainerUtil: React.FC = ({ }) => {

    return (
        <>
            {
                <section className="loading-icon z-50">
                    <ToastContainer
                        autoClose={1500}
                        theme="dark" />
                </section>
            }
        </>
    )
}

export default ToastContainerUtil