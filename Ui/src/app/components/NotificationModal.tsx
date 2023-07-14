interface modalProps {
  closeModal: Function,
}

const NotificationModal = ({ closeModal }: modalProps) => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full bg-[#0007]">
        <div className="relative w-full flex items-center justify-center h-full">
          <div className="relative bg-[#0e0e10] rounded-lg shadow  w-[500px]">
            <div className="flex items-center justify-between p-5 border-b border-gray-800 rounded-t">
              <h3 className="text-xl font-medium ">Connect Wallet</h3>
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

            <div className="p-6 space-y-6">
              <h3 className="text-center text-2xl font-bold">Modal Message</h3>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
