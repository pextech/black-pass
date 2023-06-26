import { HashConnect, HashConnectTypes, MessageTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import React, { useCallback, useEffect, useState } from "react";

//initialize hashconnect
const hashConnect = new HashConnect(true);

//Intial App config
let appMetaData = {
    name: "dApp Example",
    description: "An example hedera dApp",
    icon: "https://absolute.url/to/icon.png",
  };


const UseHashConnect = async () => {

  let initData = await hashConnect.init(appMetaData, "testnet", false)

  console.log(initData, "hashconnect")

  hashConnect.foundExtensionEvent.once((walletMetaData) => {
    hashConnect.connectToLocalWallet(initData.pairingString, walletMetaData)
  })

  hashConnect.pairingEvent.once((pairingData) => {
    console.log('wallet paired')
    console.log(pairingData, "pairing data")

    // const accountId = document.getElementById('accountId')
    // accountId.innerHTML = pairingData.accountIds[0]
  })

  return initData;
}

export default UseHashConnect