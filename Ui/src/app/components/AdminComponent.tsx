'use client'

import React, {useState} from 'react'
import { BiSearch } from 'react-icons/bi'

const dummyData = [
  {
    walletAddress: "343njjdjj3jdjd",
    username: "jaa23",
    tierPass: "Tier 1",
    status: "claimed",
    rewardAmounts: 100000
  },
  {
    walletAddress: "343njjdjj3jdjd",
    username: "martha12",
    tierPass: "Tier 1",
    status: "claimed",
    rewardAmounts: 100000
  },
  {
    walletAddress: "343njjdjj3jdjd",
    username: "john3",
    tierPass: "Tier 1",
    status: "claimed",
    rewardAmounts: 100000
  },
  {
    walletAddress: "james888939",
    username: "harry2",
    tierPass: "Tier 1",
    status: "claimed",
    rewardAmounts: 100000
  }
]

const AdminComponent = () => {

  const [searchAddress, setSearchAddress] = useState("");

  

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
                        <th className='px-6 py-4'>Username</th>
                        <th className='px-6 py-4'>Black Tier Pass</th>
                        <th className='px-6 py-4'>Status</th>
                        <th className='px-6 py-4'>Total Rewards Amount</th>
                        <th className='px-6 py-4'>Actions</th>
                    </tr>
                </thead>

                <tbody>
                  {dummyData.filter((data) => {
                    return searchAddress.toLowerCase() === "" ? data : data.walletAddress.toLowerCase().includes(searchAddress)
                  }).map((data) => (
                    <tr key={data.walletAddress} className='border-b border-gray-600'>
                      <td className='px-6 py-4'>{data.walletAddress}</td>
                      <td className='px-6 py-4'>{data.username}</td>
                      <td className='px-6 py-4'>{data.tierPass}</td>
                      <td className='px-6 py-4'>{data.status}</td>
                      <td className='px-6 py-4'>{data.rewardAmounts}</td>
                      <td className='px-6 py-4 flex gap-4 justify-center'>
                        <button className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                                Revoke
                        </button>
                        <button className="bg-[#163331] text-[#16B2A4] py-2 md:px-8 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                                Add Reward
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