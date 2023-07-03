'use client'
import { HashConnect } from "hashconnect";
import React, { useState } from "react";

//initialize hashconnect
const hashConnect = new HashConnect(true);

//Intial App config
let appMetaData = {
    name: "Black Pass",
    description: "Black Pass loyalty program",
    icon: "https://absolute.url/to/icon.png",
  };


const UseHashConnect = async (setProvider, setUserHederaAccount, setUserClient) => {

  let initData = await hashConnect.init(appMetaData, "testnet", false)
  let pairingData;

  hashConnect.foundExtensionEvent.once((walletMetaData) => {
    hashConnect.connectToLocalWallet(initData.pairingString, walletMetaData)
  })

  hashConnect.pairingEvent.once((data) => {
    console.log('wallet paired')
    console.log(data, "pairing data")
    const provider = hashConnect.getProvider(data.pairingData.network, data.pairingData.topic, data.pairingData?.accountIds[0])
    setProvider(provider)
    setUserHederaAccount(data.pairingData?.accountIds[0])
    setUserClient(hashConnect.getSigner(provider))
  })

}

export default UseHashConnect