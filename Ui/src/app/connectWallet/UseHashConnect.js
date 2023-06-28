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


const UseHashConnect = async () => {

  let initData = await hashConnect.init(appMetaData, "testnet", false)

  hashConnect.foundExtensionEvent.once((walletMetaData) => {
    hashConnect.connectToLocalWallet(initData.pairingString, walletMetaData)
  })

  hashConnect.pairingEvent.once((pairingData) => {
    console.log('wallet paired')
    console.log(pairingData, "pairing data")
  })

  

  return initData;
}

export default UseHashConnect