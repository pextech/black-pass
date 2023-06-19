import React from "react";
import Image from "next/image";
import ConnectWalletButton from "./ConnectWalletButton";

const LandingPageCard = () => {
  return (
    <div className="flex items-center justify-center mt-20">
      <div className="flex items-center justify-center flex-col w-[700px] text-center">
        <h1 className="text-[46px] font-bold">Welcome Milovan</h1>
        <p>
          Welcome to the Astra Nova Black Pass portal. Thank you for creating
          your account. You now have the exciting opportunity to redeem a free
          Black Pass NFT card.
        </p>
        <Image />

        <div className="my-6">
          <ConnectWalletButton btnTitle="Redeem Black Pass" />
        </div>
      </div>
    </div>
  );
};

export default LandingPageCard;
