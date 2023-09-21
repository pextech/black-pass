'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ConnectWalletButton from "./ConnectWalletButton";
import BlackPassImg from '../assets/black-pass-image.png'
import { redeemBlackPass, getPlayerRewards, getBlackPassBalance } from "../service/HederaServices";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHashConnectContext } from "../context/useHashConnect";
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
}

const LandingPageCard = ({ username, userPlayerId, accountId, userClient, disableHandle, hasClaimed }: landingPageProps) => {



  const [isLoading, setIsLoading] = useState(false)
  const [playerReward, setPlayerReward] = useState<any>([]);
  const [playerBalance, setPlayerBalance] = useState(0);

  const { state, admin, refetchDataPlayer, handleRefetch, isConnect, setIsConnect, tempAccountId } = useHashConnectContext();


  const getPlayerBalance = async () => {
    try {
      const getDataBalance = await getBlackPassBalance(accountId)
      setPlayerBalance(getDataBalance)
      // console.log("player balance", getDataBalance)
    } catch (error) {
      console.log(error)
    }
  }

  const playerRewardData = async () => {
    try {
      const playerReward = await getPlayerRewards(accountId)
      // console.log(playerReward)
      const playerRewardArray = Object.values(playerReward)[0];
      setPlayerReward(playerRewardArray)

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    setTimeout(() => {
      const dataLocalStorage = {
        accountId: state.pairingData?.accountIds[0] || tempAccountId,
        isConnect: true,
        expiration: new Date().getTime() + 10 * 60 * 1000, // Expiration time in milliseconds (10 minutes)
      };

      localStorage.setItem('myData', JSON.stringify(dataLocalStorage));

      setIsConnect(true)
    }, 3000);
  }, [])

  useEffect(() => {
    playerRewardData()
    getPlayerBalance()

  }, [admin, refetchDataPlayer])



  const reedemBlackPass = async () => {
    try {
      console.log('started')
      setIsLoading(true)
      toast("redeeming Black Pass...", { className: 'toast-loading', pauseOnHover: false })
      await redeemBlackPass(accountId, userClient)
      setIsLoading(false)

    } catch (error) {
      console.log(error, "redeem error")
      setIsLoading(false)
    } finally {
      handleRefetch()
    }
  }


  return (
    <div className=" flex items-center justify-center mt-20 mx-6">
      {admin ? (
        <AdminComponent accountId={accountId} />
      ) : (
        <div className="flex items-center justify-center flex-col md:w-[900px] text-center">
          <h1 className="md:text-[46px] text-[35px] font-bold mb-3 capitalize">
            Welcome {username}
          </h1>


          {hasClaimed && isConnect ? (
            <StakingComponent playerBalance={playerBalance} data={playerReward} accountId={accountId} userClient={userClient} />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p>
                Welcome to the Astra Nova Black Pass portal. Thank you for creating
                your account. You now have the exciting opportunity to redeem a free
                Black Pass NFT card.
              </p>
              <Image className="w-[50%]" src={BlackPassImg} width={350} height={350} alt="NFT" priority />

              <div className="my-6">
                <ConnectWalletButton disableHandle={disableHandle} btnTitle="Redeem Black Pass" handleClick={reedemBlackPass} />
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
