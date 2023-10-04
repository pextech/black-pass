'use client'

import { useState } from "react";
import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineClose } from "react-icons/ai"
import { useHashConnectContext } from "../context/useHashConnect";
import Modals from "./Modals";

const NavBar = () => {

  const [isActiveDrawer, setActiveDrawer] = useState(false);
  const {
    connectToExtension,
    status,
    disconnect,
    clearPairings,
    state,
    modal,
    closeModal,
    openModal,
    bladeConnectStatus,
    disconnectBlade,
    bladeAccountId,
    connectBlade,
    admin,
    setAdmin,
    adminAccountId,
    hashAccountId,
    setIsConnect,
    isConnect,
    tempAccountId
  } = useHashConnectContext();

  const accountId = bladeAccountId || hashAccountId

  const handleToggle = () => {
    setActiveDrawer(!isActiveDrawer);
  };

  const connectWallet = () => {
    if (status === "Paired" || isConnect) {
      disconnect()
      clearPairings()
      localStorage.removeItem('myData');
      location.reload()
    } if (bladeConnectStatus) {
      disconnectBlade()
      localStorage.removeItem('myData');
      setIsConnect(false)
      location.reload()
    } else {
      openModal()
    }
  }

  const handleAdmin = () => {
    setAdmin(!admin)
  }


  return (
    <div>
      <div className="md:flex md:justify-around md:items-center md:my-4 hidden text-white">
        <div className="flex gap-8 items-center">
          <Link href='/'>
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
          </Link>
          <Link className="active:text-red-600" href="/">
            Redeem Black Pass
          </Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/community">Community</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div className="flex items-center">
          {adminAccountId === bladeAccountId && <button onClick={handleAdmin} className="">Admin</button>}
          <p className="mx-8 text-[#16B2A4]">{state.pairingData?.accountIds[0] || bladeAccountId || tempAccountId}</p>
          <ConnectWalletButton btnTitle={bladeConnectStatus ? "Disconnect" : isConnect ? "Disconnect" : status === "Paired" ? state.pairingData?.accountIds[0] ? 'Disconnect' : 'Connecting' : "Connect Wallet"} handleClick={connectWallet} />
        </div>

      </div>
      {modal && <Modals closeModal={closeModal} connectHash={connectToExtension} connectBlade={connectBlade} />}


      {/* mobile Navbar */}

      <div className="md:hidden flex items-center justify-between mx-auto mt-4 text-white">
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

          {
            isActiveDrawer && (
              <div className=''>
                <button onClick={() => setActiveDrawer(false)} className="fixed top-2 left-6 p-2 text-white hover:text-gray-600 z-50 shadow-xl">
                  <AiOutlineClose className="mx-4 text-3xl shadow-lg" />
                </button>

                <div className={`flex flex-col py-6 px-8 gap-6 fixed inset-y-0 right-0 w-72 z-50 transform transition-transform ease-in-out duration-300 bg-black ${isActiveDrawer ? "translate-x-0" : "translate-x-full"
                  }`}>

                  <div className="">
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
                  <Link className="active:text-red-600" href="/">
                    Redeem Black Pass
                  </Link>
                  <Link href="/faqs">FAQs</Link>
                  <Link href="/community">Community</Link>
                  <Link href="/blog">Blog</Link>
                  <ConnectWalletButton btnTitle={bladeConnectStatus ? "Disconnect" : status === "Paired" ? state.pairingData?.accountIds[0] ? 'Disconnect' : 'Connecting' : "Connect Wallet"} accountId={state.pairingData?.accountIds[0] || bladeAccountId} handleClick={connectWallet} />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default NavBar;
