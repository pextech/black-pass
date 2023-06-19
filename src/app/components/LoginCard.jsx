import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

const LoginCard = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="bg-[#0e0e10] p-12 rounded-xl flex-col justify-center flex items-center mt-10 w-[550px] max-w-full">
        <h1 className="font-bold text-[22px] text-center mb-4">
          Redeem Black Pass
        </h1>
        <p className="mb-3">
          On this page, you will be able to redeem your Black Pass. here are the
          requirement <br></br>for redeeming the Black Pass:
        </p>

        <div className="flex gap-5 mb-3 border-b border-white pb-3">
          <p>A)</p>
          <div>
            <p>
              Deviants holders can stake their NFT to train it to get the
              animated version.
            </p>
            <p>1. 100 days training - unlocks free animation update</p>
          </div>
        </div>

        <div className="flex gap-5 mb-3 border-b border-white pb-3">
          <p>A)</p>
          <div>
            <p>
              Deviants holders can stake their NFT to train it to get the
              animated version.
            </p>
            <p>1. 100 days training - unlocks free animation update</p>
          </div>
        </div>

        <div className="flex gap-5 mb-3 border-b border-white pb-3">
          <p>A)</p>
          <div>
            <p>
              Deviants holders can stake their NFT to train it to get the
              animated version.
            </p>
            <p>1. 100 days training - unlocks free animation update</p>
          </div>
        </div>

        <div className="flex justify-center my-5">
          <ConnectWalletButton btnTitle="Connect Wallet" />
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
