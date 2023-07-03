'use client'

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import {db} from './firebase.config'
import {collection, getDocs} from 'firebase/firestore';
import {useHashConnectContext} from './context/useHashConnect';

interface User {
  id: string;
}

export default function Home() {


  const [accountIsAvailable, setAccountIsAvailable] = useState(false);
  const [username, setUsername] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const { connectToExtension, status, pairingData, provider, userClient, state } = useHashConnectContext();
  const accountId = state.pairingData?.accountIds[0] || ""
  
  const userCollectionRef = collection(db, "users")

  const connectWallet = async () => {
    await connectToExtension()
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
      state.pairingData?.accountIds[0]  && !accountIsAvailable ? <CreateAccountCard accountId={accountId} /> 
      : state.pairingData?.accountIds[0] && accountIsAvailable ? <LandingPageCard username={username} accountId={accountId} userPlayerId={1} userClient={userClient}  /> 
      : <LoginCard handleConnect={connectWallet} />}
    </main>
  );

}
