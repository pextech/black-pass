import React from 'react'
import ConnectWalletButton from './ConnectWalletButton'

const RewardHistory = () => {
  return (
    <div className='w-full mt-12'>
        <div className='text-left font-medium text-2xl border-b border-neutral-500 pb-2'>
            <h3 className=''>All Rewards</h3>
        </div>

        <div className=''>
            <table className='w-full text-left table-auto'>
                <thead className='border-b border-neutral-500'>
                    <tr className=''>
                        <th className='pr-6 py-4'>Rewards Amount</th>
                        <th className='px-6 py-4'>Rewarded Date</th>
                        <th className='px-6 py-4'>Status</th>
                        <th className='px-6 py-4'>
                           <button className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                                Claim
                            </button>
                        </th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
  )
}

export default RewardHistory