"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData, getBlackPassBalance, getPlayerRewards, getAllAdminRewards } from "./service/HederaServices";

interface User {
  id: string;
}

interface PlayerData {
  username: string,
  playerAddress: string,
  email: string,
  active: boolean,
  reedemed: boolean,
  telegram?: string,
  discord?: string,
  twitter?: string
}


export default function Home() {

  const [playerBalance, setPlayerBalance] = useState(0);
  const [playerReward, setPlayerReward] = useState(0);
  const [playerData, setPlayerData] = useState<PlayerData>()
  const [userId, setUserId] = useState()
  const [hasClaimed, setHasClaimed] = useState(false)
  const [users, setUsers] = useState<User[]>([]);
  const {
    connectToExtension,
    userClient,
    state,
    modal,
    openModal,
    closeModal,
    connectBlade,
    bladeAccountId,
    bladeSigner,
  } = useHashConnectContext();
  const accountId = state.pairingData?.accountIds[0] || "" || bladeAccountId;
  
 
  // const userCollectionRef = collection(db, "users");

  const connectWallet = async () => {
    await connectToExtension();
    closeModal()
  };

  // useEffect(() => {

  //       const getUser = async () => {
  //         const data = await getDocs(userCollectionRef);
  //         setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //       };
    
  //       getUser();

      
  //       searchUserByAccountId(users, accountId);
  //       searchUserByAccountId(users, bladeAccountId);

  // }, [accountId, bladeAccountId]);

useEffect(() => {
    const getData = async () => {
      try {
        const getData:any = await getPlayerData(accountId) 
        setPlayerData(getData)
        // console.log("this is player data", getData)
      } catch (error) {
        console.log(error)
      }
    }
    const getPlayerBalance = async () => {
      try {
        const getDataBalance = await getBlackPassBalance(accountId)
        const playerReward = await getPlayerRewards(accountId)
        const adminReward = await getAllAdminRewards()
        console.log("this is player balance", getDataBalance)
        console.log("this is player reward", playerReward)
        setPlayerReward(playerReward)
        console.log("this is admin reward", adminReward)
        setPlayerBalance(getDataBalance)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
    getPlayerBalance()
},[accountId]) 



console.log("player data", playerData)
console.log("player reward", playerReward)

     

  // function searchUserByAccountId(users: any, accountId: string) {
  //   for (let i = 0; i < users.length; i++) {
  //     if (users[i].accountId === accountId) {
  //       setAccountIsAvailable();
  //       setUsername(users[i].username);
  //       setPlayerId(users[i].playerId);
  //       setUserId(users[i].id)
  //       setHasClaimed(users[i].hasClaimed)
  //     }
  //   }
  //   return null; // User not found
  // }



  return (
    <main className="h-screen text-white">
      { playerData?.active === false ? (
        <CreateAccountCard accountId={accountId || bladeAccountId} />
      ) : playerData?.active === true ? (
        <LandingPageCard
          username={playerData?.username}
          accountId={accountId || bladeAccountId}
          userPlayerId={1}
          userClient={userClient || bladeSigner}
          disableHandle={playerData?.reedemed ? true : false}
          id={userId}
          hasClaimed={playerData?.reedemed}
          playerBalance={playerBalance}
        />
      ) : (
        <LoginCard handleConnect={openModal} />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={connectBlade} />}
    </main>
  );
}
