'use client'

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useRouter } from 'next/navigation'
import { HashConnect } from "hashconnect";
import { useState, useEffect } from "react";
import {db} from './firebase.config'
import {collection, getDocs} from 'firebase/firestore';

export default function Home() {

  const [accountId, setAccountId] = useState('')
  const [isLogin, setIsLogin] = useState(false);
  const [accountIsAvailable, setAccountIsAvailable] = useState(false);
  const [username, setUsername] = useState('')
  const router = useRouter()
  const [users, setUsers] = useState([])
  const userCollectionRef = collection(db, "users")

  //initialize hashconnect
const hashConnect = new HashConnect(true);

//Intial App config
let appMetaData = {
    name: "Black Pass",
    description: "Black Pass loyalty program",
    icon: "https://absolute.url/to/icon.png",
  };

  const searchAccount = (accountId, users) => {
    for (let i=0; i < users.length; i++) {
        if (users[i].accountId === accountId) {
         setUsername(users[i].username)
         setAccountIsAvailable(true)
        }
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    getUser()
    searchAccount(accountId, users)
},[])


console.log(users)
console.log(accountIsAvailable)

  const useHashConnect = async () => {

    let initData = await hashConnect.init(appMetaData, "testnet", false)
  
    hashConnect.foundExtensionEvent.once((walletMetaData) => {
      hashConnect.connectToLocalWallet(initData.pairingString, walletMetaData)
    })
  
    hashConnect.pairingEvent.once((pairingData) => {
      setAccountId(pairingData.accountIds[0])
      setIsLogin(true)
    })

    let topic = initData.topic

    let disconnect = hashConnect.disconnect(topic)
    
    console.log(initData.topic, "this is init data with topic")
    return {initData, disconnect};
  }
  
  console.log(accountId, "this is account Id")

  return (
    <main className="h-screen">
      {
      isLogin && !accountIsAvailable ? <CreateAccountCard accountId={accountId} /> 
      : isLogin && accountIsAvailable ? <LandingPageCard username={username} /> 
      : <LoginCard handleConnect={useHashConnect} />}
      {/* {isLogin ? <LandingPageCard username={username} /> : <LoginCard handleConnect={useHashConnect} />} */}
    </main>
  );
}
