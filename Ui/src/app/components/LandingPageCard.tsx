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
import { doc, updateDoc } from "firebase/firestore";
import { BiLogoBitcoin } from "react-icons/bi";

interface landingPageProps {
  username: string,
  userPlayerId: number,
  accountId: string,
  userClient: any,
  disableHandle?: any,
  id: any,
  hasClaimed: boolean
}

const LandingPageCard = ({ username, userPlayerId, accountId, userClient, disableHandle, id, hasClaimed }: landingPageProps) => {
  
  console.log('userClient', userClient)
  console.log('accountId', accountId)
  console.log('userPlayerId', userPlayerId)

  const loading = () => toast.loading("redeeming Black Pass...", {className: 'toast-loading'})
  const toastSuccess = () => toast.success('Successfully redeem Black Pass');
  const toastError = () => toast.error('Redeem failed');
  const [isLoading, setIsLoading] = useState(false)

  const { state } = useHashConnectContext();


  const usersRef = doc(db, "users", id);
  const handleClaim = async() => {
    await updateDoc(usersRef, {
      hasClaimed: true
    });  
   }

  const reedemBlackPass = async () => {
    try {
      if (userPlayerId) {
        console.log('started')
        setIsLoading(true)
        loading()
        await redeemBlackPass(accountId, userPlayerId, userClient)
        setIsLoading(false)
        toastSuccess()
        handleClaim()  
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


        {!hasClaimed ? (
           <div>
              <p className=" mb-6">Congratulations on successfully redeeming your Black Pass!</p>

              <div className="flex items-center justify-center gap-7">

                <div className="bg-[#0E0E10] rounded-2xl py-4 px-10 text-left">
                  <BiLogoBitcoin className='text-[2.2rem]' />
                  <p className="text-[#6C7284] my-3">Black Pass Tier</p>
                  <h3 className="text-xl font-semibold">Tier 1</h3>
                </div>

                <div className="bg-[#0E0E10] rounded-2xl py-4 px-10 text-left">
                  <BiLogoBitcoin className='text-[2.2rem]' />
                  <p className="text-[#6C7284] my-3">Reward Balance</p>
                  <h3 className="text-xl font-semibold">1.23 $RVV</h3>
                </div>

                <div className="bg-[#0E0E10] rounded-2xl py-4 px-10 text-left hover:border-red-400 border-transparent border">
                  <BiLogoBitcoin className='text-[2.2rem]' />
                  <p className="text-[#6C7284] my-3">Staking Rewards</p>
                  <h3 className="text-xl font-semibold">0</h3>
                </div>
              </div>
            </div> 
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p>
              Welcome to the Astra Nova Black Pass portal. Thank you for creating
              your account. You now have the exciting opportunity to redeem a free
              Black Pass NFT card.
            </p>
            <Image className="w-[60%]" src={BlackPassImg} width={350} height={350} alt="NFT" priority />

            <div className="my-6">
              <ConnectWalletButton disableHandle={disableHandle} btnTitle="Redeem Black Pass" handleClick={()=>{reedemBlackPass()}} />
            </div>
        </div>

        )
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
