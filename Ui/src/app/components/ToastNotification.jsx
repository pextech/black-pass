import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
    
    const toastSuccess = () => toast.success('Successfully created an account');

  return (
    <div>ToastNotification</div>
  )
}

export default ToastNotification