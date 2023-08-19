'use client'

import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { AiFillCopy } from 'react-icons/ai'
import { toast } from 'react-toastify';
import AddRewardModal from "./addRewardModal";
import { addReward, revokeReward, getAllAdminRewards } from '../service/HederaServices';
import EditRewardModal from './EditRewardModal';



interface AddReward {
  accountId: string
}

const AdminComponent = ({ accountId }: AddReward) => {

  const [searchAddress, setSearchAddress] = useState("");
  const [adminAddRewardModal, setAdminAddRewardModal] = useState(false)
  const [adminReward, setAdminReward] = useState<any>([]);
  const [adminEditModal, setAdminEditModal] = useState(false)
  const [btnEditClicked, setBtnEditClicked] = useState(false)
  const [choosenReward, setChoosenReward] = useState()

  const [addRewardData, setAddRewardData] = useState({
    walletAddress: '',
    rewardAmount: 0
  })

  const [editRewardData, setEditRewardData] = useState({
    walletAddress: '',
    rewardAmount: 0
  })

  useEffect(() => {
    const getAdminData = async () => {
      const adminReward = await getAllAdminRewards()
      const adminRewardArray = Object.values(adminReward)[0];
      setAdminReward(adminRewardArray)
    }
    getAdminData()
  }, [accountId])

  function shortenWalletAddress(address: any) {
    const firstThreeChars = address.slice(0, 4);
    const lastThreeChars = address.slice(-4);

    return `${firstThreeChars}...${lastThreeChars}`;
  }

  console.log("admin reward", adminReward)


  const revokePlayerReward = (dataId: any) => {
    const dataChoosen = adminReward.find((data: any) => {
      if (data.id === dataId) {
        revokeReward(Number(dataId))
        console.log(dataId)
        toast("Revoking the player reward...", { className: 'toast-loading', pauseOnHover: false })
      }
    })
    console.log(dataChoosen)
  }

  const copyToClipboard = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress)
      .then(() => {
        toast.success('Address get copied')
        setTimeout(() => {
        }, 2000); // Reset copied status after 2 seconds
      })
      .catch(error => {
        console.error('Error copying text:', error);
      });
  };


  const handleSubmitAddReward = async (e: any) => {
    try {
      e.preventDefault()
      console.log(addRewardData)
      await addReward(addRewardData.walletAddress, addRewardData.rewardAmount)
      toast("adding reward...", { className: 'toast-loading', pauseOnHover: false })
      setAdminAddRewardModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitEditReward = async (rewardId: any, e?: any,) => {
    try {
      e.preventDefault()
      console.log(editRewardData)
      revokePlayerReward(rewardId)
      await addReward(editRewardData.walletAddress, editRewardData.rewardAmount)
      toast("adding new reward...", { className: 'toast-loading', pauseOnHover: false })
      setAdminEditModal(false)
      toast.success('Successfully update new reward')
    } catch (error) {
      console.log(error)
    }
  }

  const openEditModal = () => {
    setAdminEditModal(true)
  }

  const handleFormChange = (event: any) => {
    const { name, value } = event.target;
    setAddRewardData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleEditRewardFormChange = (event: any) => {
    const { name, value } = event.target;
    setEditRewardData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  console.log('this choosen reward id', choosenReward)

  return (
    <div className='w-full mx-12'>
      <div className='border-b border-gray-600 w-full'>
        <ul className=' flex gap-10 flex-wrap -mb-px'>
          <li className='text-xl '>
            <h3 className='inline-flex items-center justify-center border-b-4 pb-5 border-green-700 pr-4 rounded-t-lg active'>Send Rewards</h3>
          </li>
          <li className='text-xl '>Admin Log</li>
        </ul>
      </div>

      <p className='mt-4'>Select the wallet address to receive the $RVV token rewards.</p>

      <div className='flex justify-between w-full'>
        <div className='flex items-center border border-gray-700 rounded  w-80 my-4 px-2 py-1'>
          <BiSearch className='text-2xl' />
          <input
            type="text"
            onChange={(e) => setSearchAddress(e.target.value)}
            placeholder='Search by wallet address'
            className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none placeholder:text-[14px]'
          />
        </div>

        <div className='flex items-center'>
          <button onClick={() => setAdminAddRewardModal(true)} className="bg-[#163331] text-[#16B2A4] py-3 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
            Add Reward
          </button>
        </div>
      </div>

      <div className=''>
        <table className='w-full text-center'>
          <thead className='bg-[#0E0E10] px-4'>
            <tr className=''>
              <th className='px-6 py-4'>Wallet Address</th>
              <th className='px-6 py-4'>Black Tier Pass</th>
              <th className='px-6 py-4'>Status</th>
              <th className='px-6 py-4'>Total Rewards Amount</th>
              <th className='px-6 py-4'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {adminReward.filter((data: any) => {
              return searchAddress.toLowerCase() === "" ? data : data.playerAddress.toLowerCase().includes(searchAddress)
            }).map((data: any) => (
              <tr key={data.id} className='border-b border-gray-600'>
                <td className='px-6 py-4 flex justify-center items-center gap-3'>
                  {shortenWalletAddress(data.playerAddress)}
                  <button onClick={() => copyToClipboard(data.playerAddress)}>
                    <AiFillCopy className='text-xl active:text-sm' />
                  </button>
                </td>
                <td className='px-6 py-4'>Tier 1</td>
                <td className='px-6 py-4'>{data.claimed ? 'Claimed' : !data.claimable ? "Reward Revoked" : 'Unclaimed'}</td>
                <td className='px-6 py-4'>{Number(data.amount)}</td>
                <td className='px-6 py-4 flex gap-4 justify-center'>
                  <button disabled={!data.claimable ? true : false} onClick={() => revokePlayerReward(data.id)} className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                    Revoke
                  </button>
                  <button disabled={!data.claimable ? true : false} onClick={() => {
                    console.log(data.id)
                    openEditModal()
                    setChoosenReward(data.id)
                  }} className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adminAddRewardModal && (
        <AddRewardModal
          closeModal={() => setAdminAddRewardModal(false)}
          handleSubmit={handleSubmitAddReward}
          handleFormChange={handleFormChange}
          walletAddress={addRewardData.walletAddress}
          rewardAmount={addRewardData.rewardAmount}
        />
      )}

      {
        adminEditModal && (
          <EditRewardModal
            closeModal={() => setAdminEditModal(false)}
            walletAddress={editRewardData.walletAddress}
            rewardAmount={editRewardData.rewardAmount}
            handleEditFormChange={handleEditRewardFormChange}
            handleEditSubmit={(e: any) => handleSubmitEditReward(choosenReward, e)}
          />
        )
      }
    </div>
  )
}

export default AdminComponent