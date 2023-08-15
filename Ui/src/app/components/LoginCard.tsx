
import ConnectWalletButton from "./ConnectWalletButton";
import Image from "next/image";
import imageBg from '../assets/bg-image.png'


const LoginCard = ({handleConnect}: any) => {

  

  return (
    <div className="flex justify-center items-center w-full">
      <Image src={imageBg} alt="image-bg" className="image-bg" />
      <div className=" bg-[#0e0e10] p-12 rounded-xl flex-col justify-center flex items-center my-20 md:mb-0 md:w-[550px] w-[320px] max-w-full">
        <h1 className="font-bold text-[22px] text-center mb-4">
          Black Pass
        </h1>
        <p className="mb-3">
        Astra Nova’s Identity and loyalty program to discover exciting moments and memorable community experiences. Have it all with Black Pass!
        </p>

        <h3 className="font-bold text-[22px] mb-4">
        Make the most of every transaction
        </h3>

        <p className="mb-3">
        As the loyalty program of Astra Nova, Black Pass will change the way you experience web3 gaming. 

        Being a member offers you benefits and rewards that will make all your Gamefi experience more rewarding.
        </p>

        {/* <div className="flex gap-5 mb-3 border-b border-white pb-3">
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
        </div> */}

        <div className="flex justify-center my-5">
          <ConnectWalletButton btnTitle="Connect Wallet" handleClick={handleConnect} />
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
