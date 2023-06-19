import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const CreateAccountCard = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#0e0e10] p-12 rounded-xl flex-col justify-center flex items-center mt-10 w-[550px] max-w-full">
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
            />
          </div>

          <div className="flex flex-col mt-4">
            <label className="mb-2">Email</label>
            <input
              className="py-3 bg-[#272728] rounded-md pl-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              type="email"
              placeholder="Email"
            />
          </div>

          <div className="mt-4">
            <p className="mb-4">
              Connect Socials <span className="font-thin">(optional)</span>
            </p>
            <div className="flex justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded">
                Twiiter
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded">
                Discord
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded">
                Telegram
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-7">
          <ConnectWalletButton btnTitle="Connect Wallet" />
        </div>
      </div>
    </div>
  );
};

export default CreateAccountCard;
