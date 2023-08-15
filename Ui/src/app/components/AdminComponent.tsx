'use client'

import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { AiFillCopy } from 'react-icons/ai'
import { toast } from 'react-toastify';



interface AddReward {
  editReward: () => {},
  dummyData: any,
  revokeReward: any,
}

const AdminComponent = ({ editReward, dummyData, revokeReward }: AddReward) => {

  const [searchAddress, setSearchAddress] = useState("");

  function shortenWalletAddress(address: any) {
    const firstThreeChars = address.slice(0, 4);
    const lastThreeChars = address.slice(-4);

    return `${firstThreeChars}...${lastThreeChars}`;
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

      <div className='flex items-center border border-gray-700 rounded  w-80 my-4 px-2 py-1'>
        <BiSearch className='text-2xl' />
        <input
          type="text"
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder='Search by wallet address'
          className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none placeholder:text-[14px]'
        />
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
            {dummyData.filter((data: any) => {
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
                <td className='px-6 py-4'>{data.claimed ? 'Claimed' : 'Unclaimed'}</td>
                <td className='px-6 py-4'>{Number(data.amount)}</td>
                <td className='px-6 py-4 flex gap-4 justify-center'>
                  <button onClick={revokeReward} className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                    Revoke
                  </button>
                  <button onClick={editReward} className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminComponent