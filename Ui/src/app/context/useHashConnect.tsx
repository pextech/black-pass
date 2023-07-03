'use client'

import { createContext, useContext, PropsWithChildren, useEffect, useState } from "react";
import { HashConnect, HashConnectTypes} from "hashconnect";
import { HashConnectConnectionState } from "hashconnect/dist/types";
import { HashConnectContent } from "./hashConnect";


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
    disconnect: () => { }
});

const hashconnect = new HashConnect(true);

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
    const [state, setState] = useState({ pairingData: { accountIds: '', topic: '', network: '' } })


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

    const onConnectionChange = async (state: any) => {

        console.log('state', state)
        setState((exState) => ({ ...exState, state }))
      }

    const connectToExtension = async () => {
        let appMetadata = {
            name: "Black Pass",
            description: "This is a projecte Black Pass program, which involves Soulbound Hedera NFTs with modifiable traits and the ability to claim RVV tokens. The contract allows users to create player profiles, claim loyalty passes, and interact with NFTs and collections.",
          icon: "https://www.hashpack.app/img/logo.svg"
        }
    
        let initData = await hashconnect.init(appMetadata, "testnet", false);
    
        hashconnect.foundExtensionEvent.once((walletMetadata) => {
          hashconnect.connectToLocalWallet();
        })
    
        hashconnect.pairingEvent.once(onParingEvent)
        hashconnect.connectionStatusChangeEvent.once(onConnectionChange)
    
        let saveData = initData
        setSavedData(saveData)
    
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
        disconnect
    }}>
        {children}
    </HashConnectContext.Provider>
};

export function useHashConnectContext() {
    return useContext(HashConnectContext);
}
