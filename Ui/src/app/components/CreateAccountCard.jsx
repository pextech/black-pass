'use client'

import React, { useState } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import { addDoc, collection } from 'firebase/firestore'
import {db} from '../firebase.config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

const CreateAccountCard = ({accountId}) => {

  // const [accountData, setAccountData] = useState({
  //   username: "",
  //   email: ""
  // })

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const userCollectionRef = collection(db, "users")
  const toastSuccess = () => toast.success('Successfully created an account');
  const router = useRouter();
  

  const createUser = async () => {
    await addDoc(userCollectionRef, {username: username, email: email, accountId: accountId })
    setIsLoading(true)
    toastSuccess()
    router.push('/')
  }
  

  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#0e0e10] md:p-12 p-8 rounded-xl flex-col justify-center flex items-center mt-10 md:w-[550px] w-[320px] max-w-full">
        <h1 className="font-bold text-[22px] text-center mb-4">
          Create Account
        </h1>
        <p className="mb-3">
          On this page, you will be able to redeem your Black Pass. here are the
          requirement for redeeming the Black Pass:
        </p>

        <div className="w-full">
          <div className="flex flex-col">
            <label className="mb-2">Choose Username</label>
            <input
              className="py-3 bg-[#272728] rounded-md pl-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="text"
              placeholder="Choose username"
              onChange={(e) => {
                setUsername(e.target.value)
              }}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label className="mb-2">Email</label>
            <input
              className="py-3 bg-[#272728] rounded-md pl-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
          </div>

          <div className="mt-4">
            <p className="mb-4">
              Connect Socials <span className="font-thin">(optional)</span>
            </p>
            <div className="flex justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white text-[10px] md:text-[15px] md:py-4 md:px-10 py-2 px-5  rounded">
                Twitter
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white text-[10px] md:text-[15px] md:py-4 md:px-10 py-2 px-5 rounded">
                Discord
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white text-[10px] md:text-[15px] md:py-4 md:px-10 py-2 px-5  rounded">
                Telegram
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-7">
          <ConnectWalletButton btnTitle="Create Account" handleClick={createUser} />
        </div>

        {
            isLoading && (
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            )
          }
      </div>
    </div>
  );
};

export default CreateAccountCard;
