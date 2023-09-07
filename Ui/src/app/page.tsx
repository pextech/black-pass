"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData, getBlackPassBalance } from "./service/HederaServices";
import ConnectWalletButton from "./components/ConnectWalletButton";



interface PlayerData {
  username: string,
  playerAddress: string,
  email: string,
  active: boolean,
  reedemed: boolean,
  telegram?: string,
  discord?: string,
  twitter?: string
}


export default function Home() {

  const [playerBalance, setPlayerBalance] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData>()
  const [userId, setUserId] = useState()
  const [refetch, setRefetch] = useState(false)



  const {
    connectToExtension,
    userClient,
    state,
    modal,
    openModal,
    closeModal,
    connectBlade,
    bladeAccountId,
    bladeSigner,
    hashAccountId,
    bladeConnectStatus,
    refetchDataPlayer
  } = useHashConnectContext();
  const accountId = hashAccountId || bladeAccountId;



  const connectWallet = async () => {
    await connectToExtension();
    closeModal()
  };

  // twitter test


  const getData = async () => {
    try {
      const getData: any = await getPlayerData(accountId)
      setPlayerData(getData)
    } catch (error) {
      console.log(error)
    } finally {
      setRefetch(!refetch)
    }
  }



  const getPlayerBalance = async () => {
    try {
      const getDataBalance = await getBlackPassBalance(accountId)
      setPlayerBalance(getDataBalance)
      // console.log("player balance", getDataBalance)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getData()
    getPlayerBalance()
    // console.log("player data", playerData)
  }, [playerData, refetchDataPlayer, accountId])



  return (
    <main className="h-screen text-white">
      {bladeConnectStatus && playerData?.active === false || state.state === "Paired" && playerData?.active === false ? (
        <CreateAccountCard accountId={accountId || bladeAccountId} refetchDataPlayer={getData} />
      ) : playerData?.active === true ? (
        <div>
          <LandingPageCard
            username={playerData?.username}
            accountId={accountId}
            userPlayerId={1}
            userClient={userClient || bladeSigner}
            disableHandle={playerData?.reedemed ? true : false}
            id={userId}
            hasClaimed={playerData?.reedemed}
            playerBalance={playerBalance}
          />
          {/* <ConnectWalletButton btnTitle="twitter test" handleClick={getRequestToken} /> */}
        </div>
      ) : (
        <LoginCard handleConnect={openModal} />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={connectBlade} />}



    </main>
  );
}
