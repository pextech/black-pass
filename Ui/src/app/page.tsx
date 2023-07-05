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
  const [accountIsAvailable, setAccountIsAvailable] = useState(false);
  const [username, setUsername] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [hasClaimed, setHasClaimed] = useState(false);
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
    bladeSigner
  } = useHashConnectContext();
  const accountId = state.pairingData?.accountIds[0] || "";
  
 
  console.log(bladeConnectStatus, "blade status")
  console.log(bladeSigner, "blade signer")
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
    // searchUserByAccountId(users, bladeAccountId);
  }, [accountId, bladeAccountId]);

  

  function searchUserByAccountId(users: any, accountId: string) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].accountId === accountId) {
        setAccountIsAvailable(true);
        setUsername(users[i].username);
        setPlayerId(users[i].playerId);
        setHasClaimed(users[i].hasClaimed)
      }
    }
    return null; // User not found
  }

  return (
    <main className="h-screen">
      {state.pairingData?.accountIds[0] && !accountIsAvailable ? (
        <CreateAccountCard accountId={accountId || bladeAccountId} />
      ) : accountIsAvailable ? (
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
