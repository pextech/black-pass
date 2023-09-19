import React from 'react'
import { claimReward } from '../service/HederaServices'
import { toast } from 'react-toastify';
import { useHashConnectContext } from '../context/useHashConnect';


const RewardHistory = ({ data, accountId, userClient }: any) => {

  const { handleRefetch, setRefetchDataPlayer, refetchDataPlayer } = useHashConnectContext()

  const handleClaimReward = async (rewardId: any) => {
    const rewardChoosen = data.find((reward: any) => reward.id === rewardId);
    console.log("ini id nya", rewardChoosen)
    try {
      toast("Claiming your reward...", { className: 'toast-loading', pauseOnHover: false });
      await claimReward(Number(rewardChoosen.id), accountId, userClient);
    } catch (error) {
      console.log(error);
    } finally {
      setRefetchDataPlayer(!refetchDataPlayer)
    }
  };


  return (
    <div className='w-full mt-12 '>
      <div className='text-left font-medium text-2xl  border-neutral-500 pb-2'>
        <h3 className=''>All Rewards</h3>
      </div>

      <div className=''>
        <table className='w-full text-left'>
          <thead className='bg-[#0E0E10] px-4 rounded'>
            <tr className=''>
              <th className='px-8 py-4'>Rewards Amount</th>
              <th className='px-8 py-4'>Tier</th>
              <th className='px-8 py-4'>Status</th>
              <th className='px-8 py-4'>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.filter((item: any) => Number(item.id) !== 0).slice().reverse().map((item: any) => (
              <tr key={item.id} className='border-b border-gray-600'>
                <td className='px-8 py-4'>{Number(item.amount)}</td>
                <td className='px-8 py-4'>{item.tier === "tier-2" ? "Tier 2" : "Tier 1"}</td>
                <td className='px-8 py-4'>{item.claimed ? 'Claimed' : !item.claimable ? 'Reward Revoked' : 'Unclaimed'}</td>
                <td className='px-8 py-4'>
                  {!item.claimed ? (
                    <button disabled={item.claimable ? false : true} onClick={() => handleClaimReward(item.id)} className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                      Claim
                    </button>
                  ) : (
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