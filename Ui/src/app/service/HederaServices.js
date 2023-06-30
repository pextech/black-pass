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
  TokenType
} from '@hashgraph/sdk'
import Web3 from 'web3';
const abi = require('../../../../smart-contracts/blackPass.json');

export const operatorId = AccountId.fromString(process.env.NEXT_PUBLIC_ACCOUNT_ID || '')
const operatorKey = PrivateKey.fromString(process.env.NEXT_PUBLIC_PRIVATE_KEY || '')
export const client = Client.forTestnet().setOperator(operatorId, operatorKey)
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

export async function getSetting(fcnName) {
  const functionCallAsUint8Array = await encodeFunctionCall(fcnName, []);
  const contractCall = await new ContractCallQuery()
    .setContractId(contractId)
    .setFunctionParameters(functionCallAsUint8Array)
    .setMaxQueryPayment(new Hbar(2))
    .setGas(100000)
    .execute(client);
  const queryResult = await decodeFunctionResult(fcnName, contractCall.bytes);
  console.log(queryResult['0'].toString())
  return queryResult['0'].toString()
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

const tokenCreator = async (name, symbol) => {
  try {
    const token = await new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setTreasuryAccountId(operatorId)
      .setAdminKey(operatorKey)
      .setSupplyKey(operatorKey)
      .freezeWith(client)
      .sign(operatorKey);

    const sumbitNFTToken = await token.execute(client);
    const tokenCreateReceipt = await sumbitNFTToken.getReceipt(client);
    const tokenId = tokenCreateReceipt.tokenId;
    const tokenIdSolidity = tokenId.toSolidityAddress();

    return { tokenIdSolidity, tokenId };
  } catch (err) {
    if (err instanceof ReceiptStatusError) {
      console.log(
        'Error Creating Collection',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message,
        JSON.stringify(err, null, 2),
      );
    }
  }
};

export const collectionCreator = async (
  playerId,
  name,
  symbol,
  userClient
) => {
  try {
    const { tokenId, tokenIdSolidity } = await tokenCreator(
      name,
      symbol,
    );

    console.log(tokenId, tokenIdSolidity)

    const contractSetCollection = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'setCollection',
        new ContractFunctionParameters()
          .addString(name)
          .addString(symbol)
          .addUint256(playerId)
          .addAddress(tokenIdSolidity),
      );

    const contractSetCollectionExecute = await contractSetCollection.execute(client)
    const contractSetCollectionReceipt = await contractSetCollectionExecute.getReceipt(
      client,
    );

    const collectionId = Number(await getSetting('collectionCount'));

    console.log(
      'Contract add Collection was a ',
      contractSetCollectionReceipt.status.toString(),
    );

    return { tokenId, tokenIdSolidity, collectionId: +collectionId };
  } catch (err) {
    if (err instanceof ReceiptStatusError) {
      console.log(
        'Error Creating a Collection',
        JSON.stringify(err, null, 2),
      );
    } else {
      console.log(
        err.message,
        JSON.stringify(err, null, 2),
      );
    }
  }
};

export const playerCreator = async (userAccount) => {
  try {

    const accountAddress = AccountId.fromString(userAccount).toSolidityAddress()

    const contractSetPlayer = await new ContractExecuteTransaction()
      .setContractId(contractId)
      .setGas(3000000)
      .setFunction(
        'setPlayer',
        new ContractFunctionParameters().addString(userAccount).addAddress(accountAddress),
      )

    const contractSetPlayerExecute = await contractSetPlayer.execute(client)
    const contractSetPlayerReceipt = await contractSetPlayerExecute.getReceipt(
      client,
    );
    console.log(
      'Contract add player was added ',
      contractSetPlayerReceipt.status.toString(),
    );

    const playerId = await getSetting('playersCount');
    console.log(playerId)
    return +playerId;
  } catch (err) {
    console.log(err);

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

export const redeemBlackPass = async (playerHederaId, playerId, userClient) => {
  try {

    console.log('=============================================')

    const { tokenId, tokenIdSolidity, collectionId } = await collectionCreator(playerId, 'BLACK PASS COLLECTION', 'BPC', userClient);
console.log(tokenId && collectionId)
    console.log('=============================================')

    if (tokenId && collectionId) {
      const isAssociated = await getAccountAssociationStatus(playerHederaId, tokenId)

      console.log(isAssociated)
  
      console.log('=============================================')
    
      if (!isAssociated) {
        await associateToken(playerHederaId, userClient, tokenId)
      }
      console.log('=============================================')
  
      mintNft(tokenId).then(async (serialId) => {
        setTimeout(async () => {
          console.log('=============================================')
          if (serialId) {
            await transferNFT(playerHederaId, tokenId, serialId)
          }

        }, 3000);
      })
    }

   
    
  } catch (err) {
    console.log(err);

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

export async function transferNFT(recipientAccountId, tokenId, serialId) {
	try {
	    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(
        TokenId.fromString(tokenId),
        serialId,
        operatorId,
        AccountId.fromString(recipientAccountId),
      )
      .freezeWith(client)

    const tokenTransferSign = await tokenTransferTx.sign(operatorKey);

    const tokenTransferSubmit = await tokenTransferSign.execute(client);
    const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(
      `\n- NFT transfer: ${tokenTransferRx.status} \n`,
	);
	
	const record = await tokenTransferSubmit.getRecord(client);

    alert('Black Pass Token Minted successfully')
	} catch (error) {
	  console.log('Error transferring NFT token:', error);
	}
}

export async function mintNft(tokenId) {

  try {
    const mintTx = new TokenMintTransaction()
    .setTokenId(TokenId.fromString(tokenId))
    .setMetadata([Buffer.from('https://ipfs.io/ipfs/QmS2WUcyBfconmbKjF1vBxBQabTvUchfuzYTnRVXKDAPLN')]) 
    .setMaxTransactionFee(maxTransactionFee)

  
    const mintTxSign = await mintTx.freezeWith(client).sign(operatorKey);

	const mintTxSubmit = await mintTxSign.execute(client);

	const mintRx = await mintTxSubmit.getReceipt(client);

	console.log(`- Created NFT ${TokenId.fromString(tokenId)} with serial: ${mintRx.serials[0].low} \n`);
    return (mintRx.serials[0].low)

  } catch (error) {
   console.log('error is', error)
  }
}


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
