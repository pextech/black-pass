import React from 'react'
import ConnectWalletButton from './ConnectWalletButton'


const RewardHistory = ({data, claimPlayerReward}: any) => {
  return (
    <div className='w-full md:w-[900px] mt-12'>
        <div className='text-left font-medium text-2xl  border-neutral-500 pb-2'>
            <h3 className=''>All Rewards</h3>
        </div>

        <div className=''>
            <table className='w-full text-left table-auto'>
                <thead className='bg-[#0E0E10] px-4 rounded'>
                    <tr className=''>
                        <th className='px-8 py-4'>Rewards Amount</th>
                        <th className='px-8 py-4'>Status</th>
                        <th className='px-8 py-4'>
                           Action
                        </th>
                    </tr>
                </thead>

                <tbody>
                  {data.map((item: any) => (
                    <tr key={item.id} className='border-b border-gray-600'>
                      <td className='px-8 py-4'>{Number(item.amount)}</td>
                      <td className='px-8 py-4'>{item.claimed ? 'Claimed' : 'Unclaimed'}</td>
                      <td className='px-8 py-4'>
                        {!item.claimed ? (
                            <button onClick={claimPlayerReward} className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                                Claim
                            </button>
                        ): (
                            <button disabled className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                                Claim
                            </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default RewardHistory