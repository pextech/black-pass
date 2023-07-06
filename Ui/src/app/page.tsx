"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";

interface User {
  id: string;
}


export default function Home() {

  const [username, setUsername] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [userId, setUserId] = useState()
  const [users, setUsers] = useState<User[]>([]);
  const {
    connectToExtension,
    status,
    pairingData,
    provider,
    userClient,
    state,
    modal,
    openModal,
    closeModal,
    connectBlade,
    bladeConnectStatus,
    bladeAccountId,
    bladeSigner,
    accountAvailableStatus,
    setAccountIsAvailable,
    hasClaimed
  } = useHashConnectContext();
  const accountId = state.pairingData?.accountIds[0] || "";
  
 
  const userCollectionRef = collection(db, "users");

  const connectWallet = async () => {
    await connectToExtension();
    closeModal()
  };



  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUser();
    
  
    searchUserByAccountId(users, accountId);
    searchUserByAccountId(users, bladeAccountId);
  }, [accountId, bladeAccountId]);

  

  function searchUserByAccountId(users: any, accountId: string) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].accountId === accountId) {
        setAccountIsAvailable();
        setUsername(users[i].username);
        setPlayerId(users[i].playerId);
        setUserId(users[i].id)
        // setHasClaimed(users[i].hasClaimed)
      }
    }
    return null; // User not found
  }


  return (
    <main className="h-screen text-white">
      {state.pairingData?.accountIds[0] && !accountAvailableStatus || !accountAvailableStatus && bladeAccountId ? (
        <CreateAccountCard accountId={accountId || bladeAccountId} />
      ) : accountAvailableStatus ? (
        <LandingPageCard
          username={username}
          accountId={accountId || bladeAccountId}
          userPlayerId={1}
          userClient={userClient || bladeSigner}
          disableHandle={hasClaimed ? true : false}
        />
      ) : (
        <LoginCard handleConnect={openModal} />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={connectBlade} />}
    </main>
  );
}
