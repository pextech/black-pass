'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ConnectWalletButton from "./ConnectWalletButton";
import BlackPassImg from '../assets/black-pass-image.png'
import { redeemBlackPass } from "../service/HederaServices";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHashConnectContext } from "../context/useHashConnect";
import { db } from "../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import StakingComponent from "./StakingComponent";
import AdminComponent from "./AdminComponent";


interface landingPageProps {
  username?: string,
  userPlayerId: number,
  accountId: string,
  userClient: any,
  disableHandle?: any,
  id: any,
  hasClaimed?: boolean,
  playerBalance?: number,
  editReward: any,
  data: any,
  adminData: any,
  claimPlayerReward: () => {},
  twitterTest?: any,
  revokeReward: any
}

const LandingPageCard = ({ username, userPlayerId, accountId, userClient, disableHandle, id, hasClaimed, playerBalance, editReward, data, adminData, claimPlayerReward, twitterTest, revokeReward }: landingPageProps) => {

  // console.log('userClient', userClient)
  // console.log('accountId', accountId)
  // console.log('userPlayerId', userPlayerId)

  const [isLoading, setIsLoading] = useState(false)

  const { state, admin } = useHashConnectContext();


  // const usersRef = doc(db, "users", id);
  // const handleClaim = async() => {
  //   await updateDoc(usersRef, {
  //     hasClaimed: true
  //   });  
  //  }

  const reedemBlackPass = async () => {
    try {
      if (userPlayerId) {
        console.log('started')
        setIsLoading(true)
        toast("redeeming Black Pass...", { className: 'toast-loading', pauseOnHover: false })
        await redeemBlackPass(accountId, userClient)
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error, "redeem error")
      setIsLoading(false)
    }
  }


  return (
    <div className=" flex items-center justify-center mt-20 mx-6">
      {admin ? (
        <AdminComponent editReward={editReward} dummyData={adminData} revokeReward={revokeReward} />
      ) : (
        <div className="flex items-center justify-center flex-col md:w-[900px] text-center">
          <h1 className="md:text-[46px] text-[35px] font-bold mb-3 capitalize">
            Welcome {username}
          </h1>


          {hasClaimed ? (
            <StakingComponent twitterTest={twitterTest} playerBalance={playerBalance} data={data} claimPlayerReward={claimPlayerReward} />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p>
                Welcome to the Astra Nova Black Pass portal. Thank you for creating
                your account. You now have the exciting opportunity to redeem a free
                Black Pass NFT card.
              </p>
              <Image className="w-[60%]" src={BlackPassImg} width={350} height={350} alt="NFT" priority />

              <div className="my-6">
                <ConnectWalletButton disableHandle={disableHandle} btnTitle="Redeem Black Pass" handleClick={() => { reedemBlackPass() }} />
              </div>
            </div>

          )
          }
        </div>
      )}
    </div>
  );
};

export default LandingPageCard;
