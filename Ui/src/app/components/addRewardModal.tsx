


interface modalProps {
    closeModal: Function,
    handleSubmit: any,
    handleFormChange: any,
    walletAddress: string,
    rewardAmount: number,
}

const AddRewardModal = ({ closeModal, handleSubmit, handleFormChange, walletAddress, rewardAmount }: modalProps) => {



    return (
        <div>
            <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full bg-[#0007]">
                <div className="relative w-full flex items-center justify-center h-full">
                    <div className="relative bg-[#0e0e10] rounded-lg shadow  w-[500px]">
                        <div className="flex items-center justify-between p-5 border-b border-gray-800 rounded-t">
                            <h3 className="text-xl font-medium ">Edit Reward</h3>
                            <button
                                type="button"
                                onClick={() => closeModal(false)}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form className="py-6 px-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <label className="mb-3">Wallet Address</label>
                                <input name="walletAddress" value={walletAddress} onChange={handleFormChange} className="bg-[#272728] px-4 py-3 rounded-lg" type="text" placeholder="0xF4607Ba...Ba3e77" />
                            </div>

                            {/* <div className="flex flex-col">
                                <label className="mb-3">Black Tier Pass</label>
                                <select className="bg-[#272728] px-4 py-3 rounded-lg">
                                    <option selected>Tier Reward</option>
                                    <option value="tier1">Tier 1</option>
                                    <option value="tier2">Tier 2</option>
                                </select>
                            </div> */}

                            <div className="flex flex-col">
                                <label className="mb-3">Total Rewards Amount</label>
                                <input name="rewardAmount" value={rewardAmount} onChange={handleFormChange} className="bg-[#272728] px-4 py-3 rounded-lg" type="number" placeholder="100.000" />
                            </div>

                            <div className="flex items-center justify-center mb-6">
                                <button className="bg-[#163331] text-[#16B2A4] py-2 md:px-12 px-3 rounded-full text-[15px] md:text-[16px] hover:bg-[#10c4b3] hover:text-black cursor-pointer disabled:bg-gray-600 disabled:text-[#c4c4c4] disabled:cursor-not-allowed">
                                    Add Reward
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRewardModal;
