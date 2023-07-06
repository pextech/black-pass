import React from 'react'
import { PropagateLoader } from 'react-spinners'

function Loading() {


  return (
    <div className="bg-[#bde0fe] h-screen flex flex-col items-center justify-center">
      <div className='flex items-center space-x-6 mb-10'>
        <img className='rounded-full h-20 w-20' src="https://rahhaus.id/wp-content/uploads/2022/12/logo-lottery.png" alt="" />
        <h1 className='text-gray-600 font-bold text-lg'>Loading The LETSDRAW LOTTERY</h1>
      </div>
      <PropagateLoader color={"#4B5563"} size={30} />
    </div>
  )
}

export default Loading