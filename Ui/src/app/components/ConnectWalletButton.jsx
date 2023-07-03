"use client"

import React from "react";

const ConnectWalletButton = ({ btnTitle, handleClick, accountId }) => {
  return (
    <div className="flex flex-row justify-between">
      <button
        onClick={handleClick}
        className="bg-[#163331] text-[#16B2A4] py-3 md:px-10 px-5 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black"
      >
        {btnTitle}
      </button>
      <p className="m-3 text-[#16B2A4]">{accountId}</p>
    </div>
  );
};

export default ConnectWalletButton;
