'use client'

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import {db} from './firebase.config'
import {collection, getDocs} from 'firebase/firestore';

import { useHashConnectContext } from "./context/hashConnect";

export default function Home() {


  const [accountIsAvailable, setAccountIsAvailable] = useState(false);
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])

  const { connectToExtension, status, pairingData } = useHashConnectContext();
  const accountId = pairingData?.accountIds[0]

  const userCollectionRef = collection(db, "users")


  const connectWallet = () => {
    connectToExtension()
  }
 
  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    getUser()
    searchUserByAccountId(users, accountId) 
},[])

function searchUserByAccountId(users, accountId) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].accountId === accountId) {
      setAccountIsAvailable(true)
      setUsername(users[i].username) 
    } 
  }
  return null; // User not found
}



  return (
    <main className="h-screen">
      {
      status === "Paired"  && !accountIsAvailable ? <CreateAccountCard accountId={accountId} /> 
      : status === "Paired" && accountIsAvailable ? <LandingPageCard username={username} /> 
      : <LoginCard handleConnect={connectWallet} />}
    </main>
  );

}
