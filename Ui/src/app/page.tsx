'use client'

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import {db} from './firebase.config'
import {collection, getDocs} from 'firebase/firestore';
import { HashConnect} from "hashconnect";
import {useHashConnectContext} from './context/useHashConnect';

interface User {
  id: string;
  // Add other user properties here
}

export default function Home() {


  const [accountIsAvailable, setAccountIsAvailable] = useState(true);
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const hashconnect = new HashConnect(true);
  const { connectToExtension, status, pairingData, provider } = useHashConnectContext();
  const accountId = pairingData?.accountIds[0] || ""
  
  // const signer = hashconnect?.getSigner(provider) ?? null
  const userCollectionRef = collection(db, "users")

  console.log(provider, "this ios provider")
  // console.log(signer, "this is signer")
  // console.log(users, "this is user")
  
  

  const connectWallet = () => {
    connectToExtension()
  }
 
  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    getUser()
    searchUserByAccountId(users, accountId) 
},[accountId])

function searchUserByAccountId(users: any, accountId: string) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].accountId === accountId) {
      setAccountIsAvailable(true)
      setUsername(users[i].username) 
      setPlayerId(users[i].playerId)
    } 
  }
  return null; // User not found
}

  return (
    <main className="h-screen">
      {
      status === "Paired"  && !accountIsAvailable ? <CreateAccountCard accountId={accountId} /> 
      : status === "Paired" && accountIsAvailable ? <LandingPageCard username={username} accountId={accountId} userPlayerId={playerId ?? 1}  /> 
      : <LoginCard handleConnect={connectWallet} />}
    </main>
  );

}
