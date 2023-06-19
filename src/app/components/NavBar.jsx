import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";

const NavBar = () => {
  return (
    <div className="flex justify-around items-center my-4">
      {/* <Image src={} alt="astranova-logo" /> */}
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
      <ConnectWalletButton btnTitle="Connect Wallet" />
    </div>
  );
};

export default NavBar;
