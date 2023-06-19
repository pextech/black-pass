import React from "react";

const ConnectWalletButton = ({ btnTitle }) => {
  return (
    <div>
      <button className="bg-[#163331] text-[#16B2A4] py-3 px-10 rounded-full hover:bg-[#10c4b3] hover:text-black">
        {btnTitle}
      </button>
    </div>
  );
};

export default ConnectWalletButton;
