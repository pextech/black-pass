import React, {useState, useEffect} from "react";
import LandingPageCard from '../components/LandingPageCard'
import {collection, getDocs} from 'firebase/firestore';

import { useHashConnectContext } from '../context/useHashConnect';

const page = () => {
  const [userPlayerId, setUserPlayerId] = useState('')
  const { connectToExtension, status, pairingData, provider, userClient } = useHashConnectContext();
  const accountId = pairingData?.accountIds[0] || ""
  const [users, setUsers] = useState([])

  const userCollectionRef = collection(db, "users")


  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id || ''})));
    }

    getUser()
    searchUserByAccountId(users, accountId) 
  }, [userCollectionRef, users, accountId])
  
  function searchUserByAccountId(users, accountId) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].accountId === accountId) {
        setUserPlayerId(users[i].playerId) 
      } 
    }
    return null; // User not found
  }

  return <LandingPageCard userPlayerId={userPlayerId ?? 1} provider={provider} userClient={userClient} accountId={accountId} />;
};

export default page;