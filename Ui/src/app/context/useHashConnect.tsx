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


    const appMetadata: HashConnectTypes.AppMetadata = {
        name: "dApp Example",
        description: "An example hedera dApp",
        icon: "https://www.hashpack.app/img/logo.svg",
        url: "http://localhost:3000"
    }

    const [status, setStatus] = useState(HashConnectConnectionState.Disconnected);

    const [message, setMessage] = useState('');

    useEffect(() => {
        init();
    }, []);

    hashconnect.connectionStatusChangeEvent.on((data) => {
        setStatus(data);
        setHcData(hashconnect.hcData);
    });

    const init = async () => {
        //register events
        setUpHashConnectEvents();

        //initialize and use returned data
        let initData = await hashconnect.init(appMetadata, "testnet", false);

        setTopic(initData.topic);
        setPairingString(initData.pairingString);

        //Saved pairings will return here, generally you will only have one unless you are doing something advanced
        setPairingData(initData.savedPairings[0]);
    }

    const setUpHashConnectEvents = () => {
        //This is fired when a extension is found
        hashconnect.foundExtensionEvent.on((data) => {
            console.log("Found extension", data);
            setAvailableExtension(data);
        })

        //This is fired when a wallet approves a pairing
        hashconnect.pairingEvent.on((data: any) => {
            console.log("Paired with wallet", data);
            setPairingData(null);
            setProvider(hashconnect.getProvider(data.pairingData.network, data.pairingData.topic, data.pairingData?.accountIds[0]))
            setUserClient(hashconnect.getSigner(provider))
        });

        //This is fired when HashConnect loses connection, pairs successfully, or is starting connection
        hashconnect.connectionStatusChangeEvent.on((status) => {
            console.log("hashconnect state change event", status);
            setStatus(status);
        })
    }

    const connectToExtension = async () => {
        //this will automatically pop up a pairing request in the HashConnect extension
        hashconnect.connectToLocalWallet();
    }



    const requestAccountInfo = async () => {
        let request = {
            topic: topic,
            network: "testnet",
            multiAccount: true
        }

        await hashconnect.requestAdditionalAccounts(topic, request);
    }

    const disconnect = () => {
        hashconnect.disconnect(pairingData!.topic)
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
