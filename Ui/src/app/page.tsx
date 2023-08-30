"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData, getBlackPassBalance } from "./service/HederaServices";
import CryptoJS from 'crypto-js';
import OAuth from 'oauth-1.0a';
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


  const TWITTER_API_KEY = 'PdsgGBkiP90VqoCsR6EhqQTby';
  const TWITTER_API_SECRET = 'IGUwRbrG4RMnSHNWiymhyFeXVKSsBUJU5rIDpLSZyU6zn0oK9R';
  const oauth = new OAuth({
    consumer: {
      key: TWITTER_API_KEY,
      secret: TWITTER_API_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64);
    },
  });

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch('/api/twitter-proxy'); // Use the proxy API route
  //     const result = await response.text();
  //     console.log("ini result", result);
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

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
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getData()
    getPlayerBalance()
  }, [accountId, refetchDataPlayer])

  // console.log("player data", playerData)


  return (
    <main className="h-screen text-white">
      {bladeConnectStatus && playerData?.active === false || state.state === "Paired" && playerData?.active === false ? (
        <CreateAccountCard accountId={accountId || bladeAccountId} refetchDataPlayer={getData} />
      ) : playerData?.active === true ? (
        <div>
          <LandingPageCard
            username={playerData?.username}
            accountId={accountId || bladeAccountId}
            userPlayerId={1}
            userClient={userClient || bladeSigner}
            disableHandle={playerData?.reedemed ? true : false}
            id={userId}
            hasClaimed={playerData?.reedemed}
            playerBalance={playerBalance}
          />
          {/* <ConnectWalletButton btnTitle="twitter test" handleClick={fetchData} /> */}
        </div>
      ) : (
        <LoginCard handleConnect={openModal} />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={connectBlade} />}



    </main>
  );
}
