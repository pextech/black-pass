"use client"

interface buttonProps {
  btnTitle: string,
  handleClick: any,
  accountId?: string,
  disableHandle?: any
}

import React from "react";

const ConnectWalletButton = ({ btnTitle, handleClick, accountId, disableHandle }: buttonProps) => {
  return (
    <div className="flex flex-row justify-between">
      <button
        onClick={handleClick}
        disabled={disableHandle}
        className="bg-[#163331] text-[#16B2A4] py-3 md:px-10 px-5 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed"
      >
        {btnTitle}
      </button>
      <p className="m-3 text-[#16B2A4]">{accountId}</p>
    </div>
  );
};

export default ConnectWalletButton;
