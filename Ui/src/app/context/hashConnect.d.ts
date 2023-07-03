import { HashConnect, HashConnectTypes } from "hashconnect"
import { HashConnectConnectionState } from "hashconnect/dist/esm/types"
import { Dispatch, SetStateAction } from "react"

export type HashConnectContent = {
    hcData: object,
    topic: string,
    provider: any,
    userClient: any;
    setProvider: Function;
    setUserClient: Function;
    setTopic: Function,
    state: any,
    clearPairings: Function,
    pairingString: string,
    pairingData: HashConnectTypes.SavedPairingData | null,
    availableExtension: HashConnectTypes.WalletMetadata | null,
    status: HashConnectConnectionState,
    hashconnect: HashConnect | null
    connectToExtension: Function,
    disconnect: Function,
}