'use client'

import { ToastContainer } from 'react-toastify';

const ToasterContext = () => {
    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme='dark'
              />
        </div>
    )
}

export default ToasterContext;