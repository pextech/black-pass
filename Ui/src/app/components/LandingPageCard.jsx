'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ConnectWalletButton from "./ConnectWalletButton";
import BlackPassImg from '../assets/black-pass-image.png'
import { redeemBlackPass } from "../service/HederaServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHashConnectContext } from "../context/useHashConnect";
import { db } from "../firebase.config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const LandingPageCard = ({ username, userPlayerId, accountId, userClient, disableHandle }) => {
  
  console.log('userClient', userClient)
  console.log('accountId', accountId)
  console.log('userPlayerId', userPlayerId)

  const loading = () => toast.loading("redeeming Black Pass...", {className: 'toast-loading'})
  const toastSuccess = () => toast.success('Successfully redeem Black Pass');
  const toastError = () => toast.error('Redeem failed');
  const [isLoading, setIsLoading] = useState(false)

  const userCollectionRef = collection(db, "users");

  const {hasClaimed, setClaimed, state } = useHashConnectContext();

  // const updateHasClaimed = async (id, hasClaim) => {
  //   const userDoc = doc(db, "users", id)
  //   const newUpdate = {hasClaimed: true}
  //   await updateDoc(userDoc, {hasClaimed: true})
  // }

  const reedemBlackPass = async () => {
    try {
      if (userPlayerId) {
        console.log('started')
        setIsLoading(true)
        loading()
        await redeemBlackPass(accountId, userPlayerId, userClient)
        setIsLoading(false)
        toastSuccess()
        setClaimed()
        // updateHasClaimed(accountId, hasClaimed)
      }
    } catch (error) {
      console.log(error, "redeem error")
      toastError()
    }
  }


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
          <ConnectWalletButton disableHandle={disableHandle} btnTitle="Redeem Black Pass" handleClick={()=>{reedemBlackPass()}} />
        </div>

        {hasClaimed && 
          <p className="bg-[#0e0e10] py-2 px-4 text-[#16B2A4]">
          You already redeem the Black Pass
          </p>
        }

        {
            isLoading && (
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
            )
          }
      </div>
    </div>
  );
};

export default LandingPageCard;
