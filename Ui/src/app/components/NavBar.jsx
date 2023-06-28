'use client'

import { useState } from "react";
import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import { RxHamburgerMenu } from "react-icons/rx";
import UseHashConnect from '../connectWallet/UseHashConnect'
import { useAppSelector } from '../../redux/store'

const NavBar = () => {

  const [isActiveDrawer, setActiveDrawer] = useState(false);

  const isLogin = useAppSelector((state) => state.authReducer.value.isLogin)
  console.log(isLogin, "login status navbar")

  const handleToggle = () => {
    setActiveDrawer(!isActiveDrawer);
  };

  const connectWallet = async () => {
     await UseHashConnect()
  }



  return (
    <div>
      <div className="md:flex md:justify-around md:items-center md:my-4 hidden">
        <div className="flex gap-8 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="44">
            <path
              d="M 0.028 0.043 L 50.028 0.043 L 50.028 44.043 L 0.028 44.043 Z"
              fill="transparent"
            ></path>
            <path
              d="M 0.681 43.035 L 19.546 43.035 L 14.89 35.126 L 23.772 19.855 L 15.595 17.302 Z M 49.376 43.035 L 39.937 26.81 L 35.373 34.771 L 17.618 34.775 L 19.548 43.035 L 49.378 43.035 Z M 24.998 1.054 L 15.595 17.3 L 24.819 17.234 L 33.722 32.492 L 39.937 26.81 Z"
              fill="rgb(13,196,178)"
            ></path>
          </svg>
          <Link className="active:text-red-600" href="/">
            Redeem Black Pass
          </Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/community">Community</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <ConnectWalletButton btnTitle={isLogin ? "Disconnect Wallet" : "Connect Wallet"} handleClick={connectWallet}  />
      </div>

      {/* mobile Navbar */}

      <div className="md:hidden flex items-center justify-between mx-auto mt-4">
        <div className="ml-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="44">
            <path
              d="M 0.028 0.043 L 50.028 0.043 L 50.028 44.043 L 0.028 44.043 Z"
              fill="transparent"
            ></path>
            <path
              d="M 0.681 43.035 L 19.546 43.035 L 14.89 35.126 L 23.772 19.855 L 15.595 17.302 Z M 49.376 43.035 L 39.937 26.81 L 35.373 34.771 L 17.618 34.775 L 19.548 43.035 L 49.378 43.035 Z M 24.998 1.054 L 15.595 17.3 L 24.819 17.234 L 33.722 32.492 L 39.937 26.81 Z"
              fill="rgb(13,196,178)"
            ></path>
          </svg>
        </div>

        <div className="mr-4">
          <button onClick={handleToggle}>
            <RxHamburgerMenu className='text-[30px] cursor-pointer' />
          </button>
          
          <div className={`${isActiveDrawer ? "showDrawer" : ""} duration-500 md:static absolute bg-[#010101] md:min-h-fit min-h-[40vh] left-0 top-[-100%] md:w-auto  w-full flex items-center px-5`}>
            <div className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 p-4">
              <Link className="active:text-red-600" href="/">
                Redeem Black Pass
              </Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/community">Community</Link>
              <Link href="/blog">Blog</Link>
              <ConnectWalletButton btnTitle={isLogin ? "Disconnect Wallet" : "Connect Wallet"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
