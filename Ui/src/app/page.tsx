"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData } from "./service/HederaServices";
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


  const [playerData, setPlayerData] = useState<PlayerData>()
  const [userId, setUserId] = useState()
  const [refetch, setRefetch] = useState(false)
  const [isConnect, setIsConnect] = useState(false)
  const [isPlayerActive, setIsPlayerActive] = useState(false)



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
    refetchDataPlayer,
    admin
  } = useHashConnectContext();
  const accountId = hashAccountId || bladeAccountId;



  const connectWallet = async () => {
    try {
      await connectToExtension();
      closeModal()
    } catch (error) {
      console.log(error)
    } finally {
      setIsConnect(!isConnect)
    }
  };

  const handleConnectBlade = async () => {
    try {
      connectBlade()
    } catch (error) {
      console.log(error)
    } finally {
      setIsConnect(!isConnect)
    }
  }

  // twitter test


  const getData = async () => {
    try {
      const getData: any = await getPlayerData(accountId)
      setPlayerData(getData)
      setIsPlayerActive(getData.active)
    } catch (error) {
      console.log(error)
    }
  }





  useEffect(() => {
    getData()

    // console.log("player data", playerData)
  }, [accountId, admin])



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
          />
          {/* <ConnectWalletButton btnTitle="twitter test" handleClick={getRequestToken} /> */}
        </div>
      ) : (
        <LoginCard handleConnect={openModal} />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={handleConnectBlade} />}



    </main>
  );
}
