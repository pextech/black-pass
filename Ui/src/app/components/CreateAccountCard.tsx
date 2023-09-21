'use client'

import React, { useState, useEffect } from "react";
import ConnectWalletButton from "./ConnectWalletButton";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { playerCreator } from '../service/HederaServices'
import { useHashConnectContext } from "../context/useHashConnect";
import Link from "next/link";
import axios from 'axios'

const CreateAccountCard = ({ accountId, userClient }: any) => {


  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [twitterAccount, setTwitterAccount] = useState('')
  const [discordAccount, setDiscordAccount] = useState('')
  const [telegramAccount, setTelegramAccount] = useState('')


  const [showTwitter, setShowTwitter] = useState(false)
  const [showDiscord, setShowDiscord] = useState(false)
  const [showTelegram, setShowTelegram] = useState(false)
  const [discordAccessToken, setDiscordAccessToken] = useState()
  const [discordCallback, setDiscordCallback] = useState(false)

  const { handleRefetch, state, setIsConnect, tempAccountId } = useHashConnectContext()

  const clientId = '1142403829745336412';
  const clientSecret = 'kKvcB5YptG7Tpq1rOeZlQBmgWdjo5wv_'
  const redirectUri = 'http://localhost:3000'; // Update with your redirect URL
  const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`;


  const handleDiscordLogin = () => {
    if (!discordCallback) {
      window.location.href = authorizeUrl;
    }
    if (discordCallback) {
      console.log("it works")
      // fetchUserInfo()
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const dataLocalStorage = {
        accountId: state.pairingData?.accountIds[0] || tempAccountId,
        isConnect: true,
        expiration: new Date().getTime() + 10 * 60 * 1000, // Expiration time in milliseconds (10 minutes)
      };

      localStorage.setItem('myData', JSON.stringify(dataLocalStorage));

      setIsConnect(true)
    }, 3000);
  }, [])

  useEffect(() => {
    handleCallback()
    fetchUserInfo()
  }, [discordCallback])




  const handleCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log("this code", code)
    if (code) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const data = new URLSearchParams();
      data.append('client_id', clientId);
      data.append('client_secret', clientSecret);
      data.append('code', code);
      data.append('grant_type', 'authorization_code');
      data.append('redirect_uri', redirectUri);

      try {
        const response = await axios.post('https://discord.com/api/oauth2/token', data, { headers });
        const accessToken = response.data.access_token;
        console.log("this response", response)
        console.log('Access Token:', accessToken);
        setDiscordAccessToken(accessToken)
        fetchUserInfo()
        setDiscordCallback(true)
        toast.success("you successfully connected to discord")
        // Now you can use this access token to make authenticated API requests
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${discordAccessToken}`
        }
      });

      const userInfo = response.data;
      console.log('User Info:', userInfo.username);
      setDiscordAccount(userInfo.username)
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };


  const createUser = async () => {
    try {
      toast("Creating the account...", { className: 'toast-loading', pauseOnHover: false })
      await playerCreator(accountId, userClient, username, email, twitterAccount ?? '', discordAccount ?? '', telegramAccount ?? '')
    } catch (error) {
      console.log(error)
      toast.error("Failed creating an account")
    } finally {
      handleRefetch()
    }
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

          {showTwitter && (
            <div className="flex flex-col mt-4">
              <label className="mb-2">Twitter Account</label>
              <input
                className="py-3 bg-[#272728] rounded-md pl-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Twitter Username (optional)"
                onChange={(e) => {
                  setTwitterAccount(e.target.value)
                }}
              />
            </div>
          )}

          {showDiscord && (
            <div className="flex flex-col mt-4">
              <label className="mb-2">Discord Account</label>
              <input
                className="py-3 bg-[#272728] rounded-md pl-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Discord Username (optional)"
                onChange={(e) => {
                  setDiscordAccount(e.target.value)
                }}
              />
            </div>
          )}

          {showTelegram && (
            <div className="flex flex-col mt-4">
              <label className="mb-2">Telegram Account</label>
              <input
                className="py-3 bg-[#272728] rounded-md pl-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Telegram Username (optional)"
                onChange={(e) => {
                  setTelegramAccount(e.target.value)
                }}
              />
            </div>
          )}

          <div className="mt-4">
            <p className="mb-4">
              Connect Socials <span className="font-thin">(optional)</span>
            </p>
            <div className="flex justify-between">
              <button onClick={() => console.warn("API request reached max!")} className="bg-blue-500 hover:bg-blue-700 text-white text-[10px] md:text-[15px] md:py-4 md:px-10 py-2 px-5  rounded">
                Twitter
              </button>
              <button onClick={handleDiscordLogin} className={` ${discordCallback ? "bg-[#10c4b3] hover:bg-[#10c4b3]" : "bg-blue-500 hover:bg-blue-700"}  text-white text-[10px] md:text-[15px] md:py-4 md:px-10 py-2 px-5 rounded`}>
                {discordCallback ? "Connected" : "Discord"}
              </button>
              <button
                // onClick={() => setShowTelegram(!showTelegram)} 
                className="bg-blue-500 hover:bg-blue-700 text-white text-[10px] md:text-[15px] md:py-4 md:px-10 py-2 px-5  rounded">
                <Link href='https://t.me/astranovaofficial' rel="noopener noreferrer" target="_blank" >
                  Telegram
                </Link>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-7">
          <ConnectWalletButton btnTitle="Create Account" handleClick={createUser} />
        </div>

      </div>
    </div>
  );
};

export default CreateAccountCard;
