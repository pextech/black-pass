import {
  AccountId,
  Client,
  NftId,
  PrecheckStatusError,
  PrivateKey,
  ReceiptStatusError,
  StatusError,
  TokenAssociateTransaction,
  TokenId,
  TokenNftInfoQuery,
  TransferTransaction,
  TokenMintTransaction,
  Hbar,
  AccountBalanceQuery,
  ContractId,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  TokenGrantKycTransaction,
  TokenCreateTransaction,
  TokenType,
  AccountAllowanceApproveTransaction,
  TokenBurnTransaction,
} from '@hashgraph/sdk'
import Web3 from 'web3';
import { toast } from 'react-toastify';
const abi = require('../../../blackPass.json');
const axios = require('axios');

export const operatorId = AccountId.fromString(process.env.NEXT_PUBLIC_ACCOUNT_ID || '')
const operatorKey = PrivateKey.fromString(process.env.NEXT_PUBLIC_PRIVATE_KEY || '')
export const client = Client.forMainnet().setOperator(operatorId, operatorKey)
const contractId = ContractId.fromString(process.env.NEXT_PUBLIC_BLACK_PASS_ID || '');
const maxTransactionFee = new Hbar(20);


const web3 = new Web3();

function encodeFunctionCall(functionName, parameters) {
  const functionAbi = abi.find(
    (func) => func.name === functionName && func.type === 'function',
  );
  const encodedParametersHex = web3.eth.abi
    .encodeFunctionCall(functionAbi, parameters)
    .slice(2);
  return Buffer.from(encodedParametersHex, 'hex');
}

function decodeFunctionResult(functionName, resultAsBytes) {
  const functionAbi = abi.find((func) => func.name === functionName);
  const functionParameters = functionAbi.outputs;
  const resultHex = '0x'.concat(Buffer.from(resultAsBytes).toString('hex'));
  const result = web3.eth.abi.decodeParameters(functionParameters, resultHex);
  return result;
}

async function getSetting(fcnName, params) {
  const functionCallAsUint8Array = await encodeFunctionCall(fcnName, params);
  const contractCall = await new ContractCallQuery()
    .setContractId(contractId)
    .setFunctionParameters(functionCallAsUint8Array)
    .setMaxQueryPayment(new Hbar(10))
    .setGas(1000000)
    .execute(client);
  const queryResult = await decodeFunctionResult(fcnName, contractCall.bytes);
  return queryResult
}

export const getAccountAssociationStatus = async (
  userhederaId, tokenId
) => {
  try {
    const balanceCheckTx = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(userhederaId))
      .execute(client)
    const tokenMap = balanceCheckTx.tokens
    console.log('tokenMap', tokenMap)
    console.log('balanceCheckTx', tokenMap.get(tokenId)?.toString())
    return tokenMap.get(tokenId)?.toString()
  } catch (error) {
    console.log('HedError', error)
  }
}


export const playerCreator = async (userAccount, userClient, username, email, twitter, discord, telegram) => {
  try {

    const accountAddress = AccountId.fromString(userAccount).toSolidityAddress()

    const contractSetPlayer = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'setPlayer',
        new ContractFunctionParameters().addString(userAccount).addAddress(accountAddress).addString(username).addString(email).addString(twitter).addString(discord).addString(telegram),
      )

    const contractSetPlayerExecute = await contractSetPlayer.execute(client)
    const contractSetPlayerReceipt = await contractSetPlayerExecute.getReceipt(
      client,
    );
    console.log(
      'Contract add player was added ',
      contractSetPlayerReceipt.status.toString(),
    );

    const playerId = await getSetting('playersCount', []);
    console.log(playerId['0'].toString())

    toast.success('Successfully created an account', {className: 'toast-loading'});
    return +playerId['0'].toString();
  } catch (err) {
    console.log(err);
    toast.error('Creating account is failed', {className: 'toast-loading'});
    if (err instanceof ReceiptStatusError) {

      console.log(
        'Error Creating Player',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const playerUpdate = async (userAccount, username, email, twitter, discord, telegram) => {
  try {

    const accountAddress = AccountId.fromString(userAccount).toSolidityAddress()

    const contractUpdatePlayer = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'updatePlayer',
        new ContractFunctionParameters().addAddress(accountAddress).addString(username).addString(email).addString(twitter).addString(discord).addString(telegram),
      )

    const contractUpdatePlayerExecute = await contractUpdatePlayer.execute(client)
    const contractUpdatePlayerReceipt = await contractUpdatePlayerExecute.getReceipt(
      client,
    );
    console.log(
      'Contract update player was added ',
      contractUpdatePlayerReceipt.status.toString(),
    );

    toast.success('Successfully created an account', {className: 'toast-loading'});
  } catch (err) {
    console.log(err);
    toast.error('updating player is failed', {className: 'toast-loading'});
    if (err instanceof ReceiptStatusError) {

      console.log(
        'Error Updating Player',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const updateRewardTier = async (rewardId, tierId) => {
  try {

    const contractRevokeRewards = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'updateRewardTier',
        new ContractFunctionParameters().addUint256(rewardId).addUint256(tierId),
      )

    const contractRevokeExecute = await contractRevokeRewards.execute(client)
    const contractRevokeReceipt = await contractRevokeExecute.getReceipt(
      client,
    );
    console.log(
      'Contract update tier reward was ',
      contractRevokeReceipt.status.toString(),
    );

    toast.success('Successfully updated a reward Tier', {className: 'toast-loading'});
  } catch (err) {
    console.log(err);
    toast.error('Updating a Reward failed', {className: 'toast-loading'});
    if (err instanceof ReceiptStatusError) {

      console.log(
        'Error updating Reward',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const updateRewardAmount = async (rewardId, amount) => {
  try {

    const contractRevokeRewards = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'updateRewardAmount',
        new ContractFunctionParameters().addUint256(rewardId).addInt64(int64),
      )

    const contractRevokeExecute = await contractRevokeRewards.execute(client)
    const contractRevokeReceipt = await contractRevokeExecute.getReceipt(
      client,
    );
    console.log(
      'Contract update amount reward was ',
      contractRevokeReceipt.status.toString(),
    );

    toast.success('Successfully updated a reward amount', {className: 'toast-loading'});
  } catch (err) {
    console.log(err);
    toast.error('Updating a Reward failed', {className: 'toast-loading'});
    if (err instanceof ReceiptStatusError) {

      console.log(
        'Error updating Reward',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const revokeReward = async (rewardId) => {
  try {

    const contractRevokeRewards = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'toggleClaimableStatus',
        new ContractFunctionParameters().addUint256(rewardId).addBool(false),
      )

    const contractRevokeExecute = await contractRevokeRewards.execute(client)
    const contractRevokeReceipt = await contractRevokeExecute.getReceipt(
      client,
    );
    console.log(
      'Contract revoke reward was ',
      contractRevokeReceipt.status.toString(),
    );

    toast.success('Successfully revoked a reward', {className: 'toast-loading'});
  } catch (err) {
    console.log(err);
    toast.error('Revoke a Reward failed', {className: 'toast-loading'});
    if (err instanceof ReceiptStatusError) {

      console.log(
        'Error revoking Reward',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const redeemBlackPass = async(playerHederaId, userClient) => {
  try {

    console.log('=============================================')

      const isAssociated = await getAccountAssociationStatus(playerHederaId, process.env.NEXT_PUBLIC_BLACKPASS_TOKEN)

      console.log(isAssociated)
      console.log(process.env.NEXT_PUBLIC_BLACKPASS_TOKEN)
  
      console.log('=============================================')
    
      if (!isAssociated) {
        await associateToken(playerHederaId, userClient, process.env.NEXT_PUBLIC_BLACKPASS_TOKEN)
      }
    
    const contractMintBlackPass = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'ReedemBlackpass',
        new ContractFunctionParameters().addBytesArray([Buffer.from('https://ipfs.io/ipfs/QmRqczXXFB9xmS8VrYEsUvwxMDuNpeA9BtMGauHzcYrQgr')]).addString('https://ipfs.io/ipfs/QmRqczXXFB9xmS8VrYEsUvwxMDuNpeA9BtMGauHzcYrQgr'),
      ).freezeWithSigner(userClient)

    const contractMintBlackPassExecute = await contractMintBlackPass.executeWithSigner(userClient)

    console.log(
      'Contract mint black pass was a ',
      contractMintBlackPassExecute,
    );


    toast.success('Successfully redeem Black Pass', {className: 'toast-loading'});
    
  } catch (err) {
    console.log(err);
    toast.error('Redeem failed', {className: 'toast-loading'});
    if (err instanceof ReceiptStatusError) {
      console.log(
        'Error reddeming Black Pass',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const addReward = async (tier, playerHederaId, amount) => {
  try {

    console.log('=============================================')

    const contractAddReward = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'addReward',
        new ContractFunctionParameters().addUint256(tier).addAddress(AccountId.fromString(playerHederaId).toSolidityAddress()).addInt64(amount),
      )

    const contractAddRewardExecute = await contractAddReward.execute(client)
    const contractAddRewardReceipt = await contractAddRewardExecute.getReceipt(
      client,
    );
    console.log(
      'Contract add Reward was a ',
      contractAddRewardReceipt,
    );
    toast.success("Successfully add Reward")
  } catch (err) {
    console.log(err);
    toast.error()
    if (err instanceof ReceiptStatusError) {
      console.log(
        'Error adding Reward',
        JSON.stringify(err, null, 2),
      );
      toast.error()
    } else {
      console.log(
        err.message
      );
      toast.error()
    }
  }
};

export const addTier = async (name) => {
  try {

    console.log('=============================================')

    const contractAddTier = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'addTier',
        new ContractFunctionParameters().addString(name),
      )

    const contractAddTierExecute = await contractAddTier.execute(client)
    const contractAddTierReceipt = await contractAddTierExecute.getReceipt(
      client,
    );
    console.log(
      'Contract add Tier was a ',
      contractAddTierReceipt,
    );
    
  } catch (err) {
    console.log(err);
    toast.error()
    if (err instanceof ReceiptStatusError) {
      console.log(
        'Error adding Tier',
        JSON.stringify(err, null, 2),
      );
      toast.error()
    } else {
      console.log(
        err.message
      );
      toast.error()
    }
  }
};

export async function getBlackPassBalance(playerHederaId) {
  const balance = await getSetting('_nfts', [AccountId.fromString(playerHederaId).toSolidityAddress()]);
  // console.log("black pass balance", AccountId.fromString(playerHederaId).toSolidityAddress())
  return parseInt(balance['balance'].toString())
}

export async function getPlayerData(playerHederaId) {
  const player = await getSetting('_players', [AccountId?.fromString(playerHederaId)?.toSolidityAddress()]);

  return player
}


export async function getBlackPassNftId(playerHederaId) {
  const serialId = await getSetting('_nfts', [AccountId.fromString(playerHederaId).toSolidityAddress()]);
  console.log(serialId)
  return parseInt(serialId['serialId'].toString())
}

export async function getReward(rewardId) {
  const reward = await getSetting('_rewards', [rewardId]);

  return {amount: parseInt(reward['amount'].toString()), tier: reward['tier'].toString()}
}

export async function getPlayerRewards(playerHederaId) {
  const allRewards = await getSetting('playerRewards', [AccountId.fromString(playerHederaId).toSolidityAddress()]);

  return allRewards
}

export async function getAllTiers() {
  const allTiers = await getSetting('allTiers', []);

  return allTiers
}

export async function getAllAdminRewards() {
  const allRewards = await getSetting('allRewards', []);

  return allRewards
}


function constructNewNft(rewardAmount, currentAmount, tier) {
  const metadata = {
    "name": "Black Pass Card",
    "description": "Astra Nova is web3's first true metaRPG. Black Pass is Astra Nova's identity and loyalty program to reward community members.",
    "image": "https://ipfs.io/ipfs/QmQwuzCMK3kuSe8DX8pALfANJyzHzqnc5KYM9YP2XTfwPB",
    "animation_url": "https://ipfs.io/ipfs/QmQiyqWN7rkDUJ7SRjUnfDy1F7KfNFEpfVtJyPExrkbBob",
    "dna": "5797317f73c6ad1534f3f272fb604143a2e3ad4d",
    "edition": 1,
    "date": 1644828328513,
    "external_url": "https://astranova.world",
    "attributes": [
        {
        "trait_type": "Balance ($RVV)",
        "value": `${(rewardAmount + currentAmount).toString()}`
        },
        {
        "trait_type": "Tier",
        "value": tier
        }
    ]
  }
    

  return metadata
}

const pintoJSON = async (metadata) =>
  axios.post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, metadata, {
    headers: {
      pinata_api_key: "6b587ab26c622a549062",
      pinata_secret_api_key:
        "880aa0c3d34fa96447892701034bec5e2ccb8f1f720c4dbec48bfcaac7bfbef2",
    },
  });

async function uploadMetadataToIPFS(playerHederaId, rewardId) {
  try {
    const playerBalance = await getBlackPassBalance(playerHederaId)
    const {amount, tier} = await getReward(rewardId)

    console.log(amount, playerBalance, tier)

    const metadata = constructNewNft(amount, playerBalance, tier)
    
    const data = await pintoJSON(metadata)
    
    return data.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}

const ownNFT = async (
  tokenId,
  serialId,
  accountId,
) => {
  const nftInfos = await new TokenNftInfoQuery()
    .setNftId(new NftId(TokenId.fromString(tokenId), serialId))
    .execute(client);

  if (nftInfos[0].accountId.toString() != accountId) {
    return false;
  } else {
    return true;
  }
};

export const claimReward = async (rewardId, playerHederaId, userClient) => {
  try {

    console.log('=============================================')

    const serialId = await getBlackPassNftId(playerHederaId)

    console.log('serialId', serialId)


    const ownThisNFT = await ownNFT(process.env.NEXT_PUBLIC_BLACKPASS_TOKEN, serialId, playerHederaId)
    
    if (ownThisNFT) {
      await burnNFT(playerHederaId, serialId, userClient)
    }
    
    const cid = await uploadMetadataToIPFS(playerHederaId, rewardId)

    console.log('cid is', cid)
    
    const contractClaimRewardPass = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'claimReward',
        new ContractFunctionParameters().addUint256(rewardId).addBytesArray([Buffer.from(`https://ipfs.io/ipfs/${cid}`)]).addString(`https://ipfs.io/ipfs/${cid}`),
      ).freezeWithSigner(userClient)

    const contractRewardExecute = await contractClaimRewardPass.executeWithSigner(userClient)

    console.log(
      'Contract claim reward was a ',
      contractRewardExecute,
    );
    
    toast.success('You have successfully claim the reward')
  } catch (err) {
    console.log(err);
    toast.error('Error claiming the reward')
    if (err instanceof ReceiptStatusError) {
      console.log(
        'Error claiming a reward',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message
      );
    }
  }
};

export const associateToken = async (accountId, senderClient, tokenId) => {
  try {
    console.log(senderClient)
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId])
      .freezeWithSigner(senderClient)

    const txResponse = await transaction.executeWithSigner(senderClient)

    console.log('The transaction consensus status ', txResponse)
  } catch (error) {
    console.log('Hedera Error', error)
  }
}

export const burnNFT = async (hederaAccountId,serialId, senderClient) => {
  try {
    await transferNFT(hederaAccountId, serialId, senderClient)

    const contractbBurnToken= await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(3000000)
    .setFunction(
      'burnTokenPublic',
      new ContractFunctionParameters().addAddress(TokenId.fromString(process.env.NEXT_PUBLIC_BLACKPASS_TOKEN).toSolidityAddress()).addInt64(0).addInt64Array([serialId]),
    )

  const contractBurnTokenExecute = await contractbBurnToken.execute(client)
  const contractBurnTokenReceipt = await contractBurnTokenExecute.getReceipt(
    client,
  );
  console.log(
    'Contract burn token was a ',
    contractBurnTokenReceipt,
  );

  } catch (error) {
    console.log('Hedera Error', error)
  }
}

async function transferNFT(hederaAccountId, serialId, userCLient) {
  console.log(hederaAccountId, serialId)
	try {
	    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(
        process.env.NEXT_PUBLIC_BLACKPASS_TOKEN,
        serialId,
        hederaAccountId,
        process.env.NEXT_PUBLIC_BLACK_PASS_ID,
      )
      .freezeWithSigner(userCLient)

      const txResponse = await tokenTransferTx.executeWithSigner(userCLient)
    console.log(
      `\n- NFT transfer: ${txResponse} \n`,
	);
	
	  console.log('NFT token transferred successfully');
	} catch (error) {
	  console.error('Error transferring NFT token:', error);
	}
}
