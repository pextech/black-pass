import React from 'react'
import RewardHistory from './RewardHistory';
import Image from 'next/image';
import BlackpassTier from '../assets/blackpass-tier.png'
import RewardBalance from '../assets/reward-balance.png'
import Stakingreward from '../assets/staking-rewards.png'

interface StakingComponent {
    playerBalance: number | undefined,
    data: any,
    accountId: string,
    userClient: any
}


const StakingComponent = ({ playerBalance, data, accountId, userClient }: StakingComponent) => {
    return (
        <div className='md:w-full mb-20 flex flex-col items-center'>
            <p className="w-[340px] md:w-full mb-6">Congratulations on successfully redeeming your Black Pass!</p>

            <div className="flex md:flex-row flex-col items-center justify-center gap-7">

                <div className="flex flex-col items-center bg-[#0E0E10] rounded-2xl py-6 px-10 text-left">
                    <Image className='w-12' src={BlackpassTier} alt='blackpass-tier' />
                    <p className="text-[#6C7284] my-3">Black Pass Tier</p>
                    <h3 className="text-xl font-semibold">Tier 1</h3>
                </div>

                <div className="flex flex-col items-center bg-[#0E0E10] rounded-2xl py-6 px-10 text-left">
                    <Image className='w-12' src={RewardBalance} alt='reward-balance' />
                    <p className="text-[#6C7284] my-3">Reward Balance</p>
                    <h3 className="text-xl font-semibold">{playerBalance} $RVV</h3>
                </div>

                <div className="flex flex-col items-center bg-[#0E0E10] rounded-2xl py-6 px-10 text-left">
                    <Image className='w-12' src={Stakingreward} alt='staking-reward' />
                    <p className="text-[#6C7284] my-3">Staking Rewards</p>
                    <h3 className="text-xl font-semibold">0</h3>
                </div>
            </div>

            <RewardHistory data={data} accountId={accountId} userClient={userClient} />
        </div>
    )
}

export default StakingComponent