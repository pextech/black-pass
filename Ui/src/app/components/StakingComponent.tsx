import React from 'react'
import { BiLogoBitcoin } from "react-icons/bi";
import RewardHistory from './RewardHistory';

interface StakingComponent {
    playerBalance: any
}

const StakingComponent = ({playerBalance}: StakingComponent) => {
  return (
    <div>
        <p className=" mb-6">Congratulations on successfully redeeming your Black Pass!</p>

        <div className="flex items-center justify-center gap-7">

            <div className="bg-[#0E0E10] rounded-2xl py-4 px-10 text-left">
                <BiLogoBitcoin className='text-[2.2rem]' />
                <p className="text-[#6C7284] my-3">Black Pass Tier</p>
                <h3 className="text-xl font-semibold">Tier 1</h3>
            </div>

            <div className="bg-[#0E0E10] rounded-2xl py-4 px-10 text-left">
                <BiLogoBitcoin className='text-[2.2rem]' />
                <p className="text-[#6C7284] my-3">Reward Balance</p>
                <h3 className="text-xl font-semibold">{playerBalance} $RVV</h3>
            </div>

            <div className="bg-[#0E0E10] rounded-2xl py-4 px-10 text-left">
                <BiLogoBitcoin className='text-[2.2rem]' />
                <p className="text-[#6C7284] my-3">Staking Rewards</p>
                <h3 className="text-xl font-semibold">0</h3>
            </div>
        </div>

        <RewardHistory />
  </div> 
  )
}

export default StakingComponent