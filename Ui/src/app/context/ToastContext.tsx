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
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
        </div>
    )
}

export default ToasterContext;