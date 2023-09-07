'use client'

import { createContext, useContext, PropsWithChildren, useEffect, useState } from "react";
import { HashConnect, HashConnectTypes } from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import { HashConnectContent } from "./hashConnect";
import { BladeConnector, ConnectorStrategy } from '@bladelabs/blade-web3.js';
import { HederaNetwork } from '@bladelabs/blade-web3.js';


const HashConnectContext = createContext<HashConnectContent>({
  hcData: {},
  topic: '',
  provider: '',
  userClient: '',
  setProvider: () => { },
  setTopic: () => { },
  setUserClient: () => { },
  state: {},
  pairingString: "",
  pairingData: null,
  availableExtension: null,
  hashconnect: null,
  status: HashConnectConnectionState.Disconnected,
  connectToExtension: () => { },
  clearPairings: () => { },
  disconnect: () => { },
  modal: false,
  openModal: () => { },
  closeModal: () => { },
  connectBlade: () => { },
  bladeConnectStatus: false,
  bladeAccountId: '',
  disconnectBlade: () => { },
  setBladeSigner: () => { },
  bladeSigner: '',
  accountAvailableStatus: false,
  setAccountIsAvailable: () => { },
  setAccountNotAvailable: () => { },
  hasClaimed: false,
  setClaimed: () => { },
  admin: false,
  setAdmin: () => { },
  adminAccountId: '',
  hashAccountId: '',
  refetchDataPlayer: false,
  handleRefetch: () => { }
});

const hashconnect = new HashConnect(true);


const bladeConnector = new BladeConnector(
  ConnectorStrategy.WALLET_CONNECT, // preferred strategy is optional 
  { // dApp metadata options are optional, but are highly recommended to use
    name: "Black Pass",
    description: "This is a project Black Pass program, which involves Soulbound Hedera NFTs with modifiable traits and the ability to claim RVV tokens. The contract allows users to create player profiles, claim loyalty passes, and interact with NFTs and collections.",
    url: "https://awesome-dapp.io/",
    icons: ["some-image-url.png"]
  }
);

// params are optional, and Mainnet is used as a default
const params = {
  network: HederaNetwork.Mainnet,
  dAppCode: "SomeAwesomeDApp" // optional while testing, request specific one by contacting us
}

export default function HashConnectProvider({ children }: PropsWithChildren) {

  const [hcData, setHcData] = useState<object>(hashconnect.hcData);
  const [topic, setTopic] = useState('');
  const [pairingString, setPairingString] = useState("");
  const [pairingData, setPairingData] = useState<HashConnectTypes.SavedPairingData | null>(null);
  const [availableExtension, setAvailableExtension] = useState<HashConnectTypes.WalletMetadata>({
    name: "",
    description: "",
    icon: ""
  });
  const [provider, setProvider] = useState<any>();
  const [userClient, setUserClient] = useState<any>();
  const [savedData, setSavedData] = useState({})
  const [modal, setModal] = useState(false)
  const [state, setState] = useState({ pairingData: { accountIds: '', topic: '', network: '' } })
  const [accountAvailableStatus, setAccountAvailableStatus] = useState(false)
  const [hasClaimed, setHasClaimed] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [hashAccountId, setHashAccountId] = useState('')

  const [refetchDataPlayer, setRefetchDataPlayer] = useState(false)
  // const adminAccountId = '0.0.1140756'
  const adminAccountId = '0.0.3724217'


  const [bladeConnectStatus, setBladeConnectStatus] = useState(false);
  const [bladeAccountId, setBladeAccountId] = useState('');
  const [bladeSigner, setBladeSigner] = useState<any>()


  const appMetadata: HashConnectTypes.AppMetadata = {
    name: "dApp Example",
    description: "An example hedera dApp",
    icon: "https://www.hashpack.app/img/logo.svg",
    url: "http://localhost:3000"
  }

  const [status, setStatus] = useState(HashConnectConnectionState.Disconnected);

  useEffect(() => {
    hashconnect.pairingEvent.on(onParingEvent)
    hashconnect.connectionStatusChangeEvent.on(onConnectionChange)
    return () => {
      hashconnect.pairingEvent.on(onParingEvent)
      hashconnect.connectionStatusChangeEvent.off(onConnectionChange)
    }
  }, [])


  hashconnect.connectionStatusChangeEvent.on((data) => {
    setStatus(data);
    setHcData(hashconnect.hcData);
  });

  const onParingEvent = async (data: any) => {
    try {

      const provider = hashconnect.getProvider(data.pairingData.network, data.pairingData.topic, data.pairingData?.accountIds[0])
      setUserClient(hashconnect.getSigner(provider))
      setState((exState) => ({ ...exState, pairingData: data.pairingData }))

    } catch (error) {
      console.log(error)
    }

  }
  const openModal = () => {
    setModal(true)
  }
  const closeModal = () => {
    setModal(false)
  }

  const onConnectionChange = async (state: any) => {

    console.log('state', state)
    setState((exState) => ({ ...exState, state }))
  }

  const connectToExtension = async () => {
    let appMetadata = {
      name: "Black Pass",
      description: "This is a project Black Pass program, which involves Soulbound Hedera NFTs with modifiable traits and the ability to claim RVV tokens. The contract allows users to create player profiles, claim loyalty passes, and interact with NFTs and collections.",
      icon: "https://www.hashpack.app/img/logo.svg"
    }

    let initData = await hashconnect.init(appMetadata, "mainnet", false);

    hashconnect.foundExtensionEvent.once((walletMetadata) => {
      hashconnect.connectToLocalWallet();
    })

    hashconnect.pairingEvent.once(onParingEvent)
    hashconnect.connectionStatusChangeEvent.once(onConnectionChange)

    let saveData = initData
    setSavedData(saveData)
    setHashAccountId(saveData.savedPairings[0]?.accountIds[0])
    return saveData;
  }

  const disconnect = () => {
    hashconnect.disconnect(state.pairingData.topic)
    setPairingData(null);
    console.log("got disconnected")
  }

  const clearPairings = () => {
    hashconnect.clearConnectionsAndData();
    setPairingData(null);
  }


  // blade Connect
  const connectBlade = async () => {
    try {
      const walletDate = await bladeConnector.createSession(params);
      setBladeConnectStatus(true)
      closeModal()
      setBladeAccountId(walletDate[0])
      console.log("wallet connected", walletDate[0])
      const signerParam = bladeConnector.getSigner()
      setBladeSigner(signerParam)
    } catch (error) {
      console.log(error)
    }
  }

  const disconnectBlade = async () => {
    try {
      await bladeConnector.killSession();
      setBladeConnectStatus(false)
      console.log("blade disconnected")
    } catch (error) {
      console.log(error)
    }
  }

  const setAccountIsAvailable = () => {
    setAccountAvailableStatus(true)
  }

  const setAccountNotAvailable = () => {
    setAccountAvailableStatus(false)
  }

  const setClaimed = () => {
    setHasClaimed(true)
  }

  const handleRefetch = () => {
    setRefetchDataPlayer(!refetchDataPlayer)
  }


  return <HashConnectContext.Provider value={{
    hcData,
    hashconnect,
    topic,
    setTopic,
    provider,
    userClient,
    state,
    setUserClient,
    setProvider,
    pairingString,
    pairingData,
    availableExtension,
    status,
    connectToExtension,
    clearPairings,
    disconnect,
    modal,
    openModal,
    closeModal,
    connectBlade,
    bladeConnectStatus,
    bladeAccountId,
    disconnectBlade,
    bladeSigner,
    setBladeSigner,
    accountAvailableStatus,
    setAccountIsAvailable,
    setAccountNotAvailable,
    hasClaimed,
    setClaimed,
    admin,
    setAdmin,
    adminAccountId,
    hashAccountId,
    refetchDataPlayer,
    handleRefetch
  }}>
    {children}
  </HashConnectContext.Provider>
};

export function useHashConnectContext() {
  return useContext(HashConnectContext);
}
