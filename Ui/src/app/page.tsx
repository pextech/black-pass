"use client";

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { useState, useEffect } from "react";
import { db } from "./firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { useHashConnectContext } from "./context/useHashConnect";
import Modals from "./components/Modals";
import { getPlayerData, getBlackPassBalance, getPlayerRewards, getAllAdminRewards, addReward, claimReward } from "./service/HederaServices";
import EditRewardModal from "./components/EditRewardModal";
import CryptoJS from 'crypto-js';


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
  const [playerReward, setPlayerReward] = useState<any>([]);
  const [adminReward, setAdminReward] = useState<any>([]);
  const [playerData, setPlayerData] = useState<PlayerData>()
  const [userId, setUserId] = useState()
  const [adminEditModal, setAdminEditModal] = useState(false)

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
    hashAccountId,
    bladeConnectStatus
  } = useHashConnectContext();
  const accountId = hashAccountId || bladeAccountId;


  // const userCollectionRef = collection(db, "users");

  const connectWallet = async () => {
    await connectToExtension();
    closeModal()
  };





  const addPlayerReward = async () => {
    await addReward(accountId, 10)
    console.log('reward added')
  }

  const openEditModal = () => {
    setAdminEditModal(true)
  }

  const claimPlayerReward = async () => {
    console.log('test')
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const getData: any = await getPlayerData(accountId)
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

        const playerRewardArray = Object.values(playerReward)[0];
        const adminRewardArray = Object.values(adminReward)[0];

        setPlayerReward(playerRewardArray)
        setAdminReward(adminRewardArray)
        setPlayerBalance(getDataBalance)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
    getPlayerBalance()
  }, [accountId])


  console.log("this playerReward", playerReward)
  console.log("this admin Reward", adminReward)


  return (
    <main className="h-screen text-white">
      {bladeConnectStatus && playerData?.active === false || state.state === "Paired" && playerData?.active === false ? (
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
          editReward={openEditModal}
          data={playerReward}
          adminData={adminReward}
          claimPlayerReward={claimPlayerReward}
          revokeReward={() => console.log('test')}
        />
      ) : (
        <LoginCard handleConnect={openModal} />
      )}
      {modal && <Modals closeModal={closeModal} connectHash={connectWallet} connectBlade={connectBlade} />}
      {
        adminEditModal && (
          <EditRewardModal closeModal={() => setAdminEditModal(false)} />
        )
      }
    </main>
  );
}
