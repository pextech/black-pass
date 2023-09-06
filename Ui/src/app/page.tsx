"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData, getBlackPassBalance, getAllTiers } from "./service/HederaServices";
import * as crypto from 'crypto';
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

  // twitter test

  function generateOAuthTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
  }
  function generateOAuthNonce() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; i++) {
      nonce += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return nonce;
  }

  function generateOAuthSignature(method: any, url: any, params: any, consumerSecret: any, tokenSecret: any) {
    const baseString = generateSignatureBaseString(method, url, params);
    const signingKey = generateSigningKey(consumerSecret, tokenSecret);
    const signature = signBaseString(baseString, signingKey);
    return encodeURIComponent(signature);
  }

  function generateSignatureBaseString(method: any, url: any, params: any) {
    const encodedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    return `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(encodedParams)}`;
  }

  function generateSigningKey(consumerSecret: any, tokenSecret: any) {
    return `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  }

  function signBaseString(baseString: any, signingKey: any) {
    return crypto
      .createHmac('sha1', signingKey)
      .update(baseString)
      .digest('base64');
  }

  const consumerSecret = 'IGUwRbrG4RMnSHNWiymhyFeXVKSsBUJU5rIDpLSZyU6zn0oK9R';
  const tokenSecret = 'BnHMbInUuhlJNdYRHjP9pA59G1PaWBq9hdhMYCryK5eSN';

  const oauthSignature = generateOAuthSignature(
    'POST',
    'https://api.twitter.com/oauth/request_token',
    {
      oauth_consumer_key: 'PdsgGBkiP90VqoCsR6EhqQTby',
      oauth_token: '187175573-fgyG0AfIEa0GO3kXuGIRcCQgjU0GkOaRTfi707j1',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: generateOAuthTimestamp(),
      oauth_nonce: generateOAuthNonce(),
      oauth_version: '1.0'
    },
    consumerSecret,
    tokenSecret
  );

  async function getRequestToken() {
    const oauthConsumerKey = 'PdsgGBkiP90VqoCsR6EhqQTby';
    const oauthToken = '187175573-fgyG0AfIEa0GO3kXuGIRcCQgjU0GkOaRTfi707j1';
    const oauthSignatureMethod = 'HMAC-SHA1';
    const oauthVersion = '1.0';

    const oauthTimestamp = generateOAuthTimestamp();
    const oauthNonce = generateOAuthNonce();


    const url = `https://api.twitter.com/oauth/request_token?oauth_consumer_key=${oauthConsumerKey}&oauth_token=${oauthToken}&oauth_signature_method=${oauthSignatureMethod}&oauth_timestamp=${oauthTimestamp}&oauth_nonce=${oauthNonce}&oauth_version=${oauthVersion}&oauth_signature=${oauthSignature}`;

    const requestOptions: any = {
      method: 'POST',
      redirect: 'follow',
      mode: 'no-cors'
    };

    try {
      const response = await fetch(url, requestOptions);
      const result = await response.text();
      console.log("ini result request", result);
    } catch (error) {
      console.log('error', error);
    }
  }


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
    // getPlayerBalance()
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
