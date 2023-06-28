'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ConnectWalletButton from "./ConnectWalletButton";
import {db} from '../firebase.config'
import {collection, getDocs} from 'firebase/firestore';
import BlackPassImg from '../assets/black-pass-image.png'

const LandingPageCard = ({username}) => {




  return (
    <div className="flex items-center justify-center mt-20 mx-6">
      <div className="flex items-center justify-center flex-col w-[700px] text-center">
        <h1 className="md:text-[46px] text-[35px] font-bold mb-3 capitalize">
          Welcome {username}
        </h1>
        <p>
          Welcome to the Astra Nova Black Pass portal. Thank you for creating
          your account. You now have the exciting opportunity to redeem a free
          Black Pass NFT card.
        </p>
        <Image className="w-[60%]" src={BlackPassImg} width={350} height={350} alt="NFT" priority />

        <div className="my-6">
          <ConnectWalletButton btnTitle="Redeem Black Pass" handleClick={()=>{alert('hi')}} />
        </div>
      </div>
    </div>
  );
};

export default LandingPageCard;
