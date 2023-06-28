'use client'

import LandingPageCard from "./components/LandingPageCard";
import LoginCard from "./components/LoginCard";
import CreateAccountCard from "./components/CreateAccountCard";
import { HashConnect } from "hashconnect";
import { useState, useEffect } from "react";
import {db} from './firebase.config'
import {collection, getDocs} from 'firebase/firestore';
import {logIn, logOut} from '../redux/features/authSlice'
import { useDispatch } from "react-redux";
import { useAppSelector } from '../redux/store'

export default function Home() {

  const [accountId, setAccountId] = useState('')
  const [accountIsAvailable, setAccountIsAvailable] = useState(false);
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const userCollectionRef = collection(db, "users")

  const dispatch = useDispatch()
  const isLogin = useAppSelector((state) => state.authReducer.value.isLogin) 


  //initialize hashconnect
const hashConnect = new HashConnect(true);

//Intial App config
let appMetaData = {
    name: "Black Pass",
    description: "Black Pass loyalty program",
    icon: "https://absolute.url/to/icon.png",
  };


  useEffect(() => {
    const foundUserAccount = users.find(user => {
      if(user.accountId === accountId){
        setAccountIsAvailable(true)
        setUsername(user.username)
      }else {
        return null
      }
    })
  },[])

  useEffect(() => {
    const getUser = async () => {
      const data = await getDocs(userCollectionRef)
      setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    getUser()
},[])


console.log(users)
console.log(isLogin, "login status")
console.log(accountIsAvailable, "is account available?")

  const useHashConnect = async () => {

    let initData = await hashConnect.init(appMetaData, "testnet", false)
  
    hashConnect.foundExtensionEvent.once((walletMetaData) => {
      hashConnect.connectToLocalWallet(initData.pairingString, walletMetaData)
    })
  
    hashConnect.pairingEvent.once((pairingData) => {
      setAccountId(pairingData.accountIds[0])
      dispatch(logIn(true))
    })

    // let topic = initData.topic

    // let disconnect = hashConnect.disconnect(topic)
    
    // console.log(topic, "this is init data with topic")
    return initData;
  }

  
  console.log(accountId, "this is account Id")

  return (
    <main className="h-screen">
      {
      isLogin && !accountIsAvailable ? <CreateAccountCard accountId={accountId} /> 
      : isLogin && accountIsAvailable ? <LandingPageCard username={username} /> 
      : <LoginCard handleConnect={useHashConnect} />}
    </main>
  );

}
