import Image from 'next/image'
import React from 'react'
import imageBg from '../assets/bg-image.png'

const LoadingCard = () => {


  return (
    <div className="flex justify-center items-center w-full">
      {/* <Image src={imageBg} alt="image-bg" className="image-bg" /> */}
      <div className="flex justify-center items-center h-screen" >
        <h1 className=' text-4xl'>Connecting...</h1>
      </div>
    </div>
  )
}

export default LoadingCard