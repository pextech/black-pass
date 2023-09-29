"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData } from "./service/HederaServices";
import ConnectWalletButton from "./components/ConnectWalletButton";
import { HashConnect } from "hashconnect";
import LoadingCard from "./components/Loading";


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

const hashconnect = new HashConnect(true);

export default function Home() {


  const [playerData, setPlayerData] = useState<PlayerData>()
  const [userId, setUserId] = useState()
  const [userClientTemp, setUserClientTemp] = useState<any>();
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
    isConnect,
    setIsConnect,
    admin,
    tempAccountId,
    setTempAccountId,
    refetchDataPlayer
  } = useHashConnectContext();
  const accountId = state.pairingData?.accountIds[0] || bladeAccountId || tempAccountId;

  const hashSigner = userClient || userClientTemp

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  useEffect(() => {
    getData()
    console.log('ini player data', playerData)
  }, [accountId, admin, refetchDataPlayer])


  const connectWallet = async () => {
    try {
      await connectToExtension();
      closeModal()
    } catch (error) {
      console.log(error)
    }
  };

  const handleConnectBlade = async () => {
    try {
      connectBlade()
    } catch (error) {
      console.log(error)
    }
  }


  const currentTime = new Date().getTime();


  const checkLoggedInStatus = () => {
    const storedData: any = localStorage.getItem('myData');
    const hashconnectData: any = localStorage.getItem('hashconnectData');
    const bladeSession: any = localStorage.getItem('wc@2:client:0.3//session')

    const parsedData = storedData ? JSON.parse(storedData) : null;

    // hashconnect session
    if (hashconnectData) {
      const parsedHashconnectData = hashconnectData ? JSON.parse(hashconnectData) : null

      const provider = hashconnect.getProvider(parsedHashconnectData?.pairingData[0].network, parsedHashconnectData.pairingData[0].topic, parsedHashconnectData.pairingData[0].accountIds[0])
      setUserClientTemp(hashconnect.getSigner(provider))

      const lastUsed = parsedHashconnectData?.pairingData[0].lastUsed + 10 * 60 * 1000 || 0 // Expiration time in milliseconds (10 minutes)

      if (lastUsed > currentTime) {
        const isConnectData = parsedData?.isConnect;
        const accountIdTemp = parsedData?.accountId

        setTempAccountId(accountIdTemp)
        setIsConnect(isConnectData);
      }
      else {
        localStorage.removeItem('myData');
        localStorage.removeItem('hashconnectData');
      }
    }

    // blade session
    const bladeSessionData = JSON.parse(bladeSession)
    const sessionDataUserBlade = bladeSessionData[0] || null
    if (sessionDataUserBlade) {
      console.log('ini blade session', bladeSessionData[0].expiry)
      const bladeSessionExpiry = bladeSessionData[0].expiry


      if (parsedData?.expiration > currentTime) {
        const isConnectData = parsedData?.isConnect;
        const accountIdTemp = parsedData?.accountId

        setTempAccountId(accountIdTemp)
        setIsConnect(isConnectData);
      } else {
        localStorage.removeItem('myData');
      }
    }
    // else {
    //   localStorage.removeItem('myData');
    // }
  };


  const getData = async () => {
    try {
      if (accountId) {
        const getData: any = await getPlayerData(accountId)
        setPlayerData(getData)
        setIsPlayerActive(getData.active)
      }
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <main className="h-screen text-white">
      {bladeConnectStatus && isConnect && playerData?.active === false || state.state === "Paired" && isConnect && playerData?.active === false || playerData?.active === false && isConnect ? (
        <CreateAccountCard accountId={accountId || bladeAccountId} refetchDataPlayer={getData} />
      ) : playerData?.active && isConnect || playerData?.active ? (
        <div>
          <LandingPageCard
            username={playerData?.username}
            accountId={accountId}
            userPlayerId={1}
            userClient={hashSigner || bladeSigner}
            disableHandle={playerData?.reedemed ? true : false}
            id={userId}
            hasClaimed={playerData?.reedemed}
          />
          {/* <ConnectWalletButton btnTitle="twitter test" handleClick={getRequestToken} /> */}
        </div>
      ) : !bladeConnectStatus && !isConnect || state.state === "Disconnected" && !isConnect ? (
        <LoginCard handleConnect={openModal} />
      ) : (
        <LoadingCard />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={handleConnectBlade} />}



    </main>
  );
}
