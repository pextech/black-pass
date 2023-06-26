'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ConnectWalletButton from "./ConnectWalletButton";
import {db} from '../firebase.config'
import {collection, getDocs} from 'firebase/firestore';
import BlackPassImg from '../assets/black-pass-image.png'

const LandingPageCard = () => {

  const [user, setUser] = useState([])
  const userCollectionRef = collection(db, "users")

  useEffect(() => {
      const getUser = async () => {
        const data = await getDocs(userCollectionRef)
        setUser(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
      }

      getUser()
  }, [])

  console.log(user[0])

  return (
    <div className="flex items-center justify-center mt-20 mx-6">
      <div className="flex items-center justify-center flex-col w-[700px] text-center">
        <h1 className="md:text-[46px] text-[35px] font-bold mb-3 capitalize">
          {/* Welcome {user[0].username} */}
          Welcome Haris
        </h1>
        <p>
          Welcome to the Astra Nova Black Pass portal. Thank you for creating
          your account. You now have the exciting opportunity to redeem a free
          Black Pass NFT card.
        </p>
        <Image className="w-[60%]" src={BlackPassImg} width={350} height={350} alt="NFT" />

        <div className="my-6">
          <ConnectWalletButton btnTitle="Redeem Black Pass" />
        </div>
      </div>
    </div>
  );
};

export default LandingPageCard;
