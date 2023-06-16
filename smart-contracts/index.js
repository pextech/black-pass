
require("dotenv").config();
const {
	Client,
	AccountId,
	PrivateKey,
	TokenInfoQuery,
	AccountBalanceQuery,
	TokenCreateTransaction,
	FileCreateTransaction,
	FileAppendTransaction,
	Hbar,
	ContractCreateTransaction,
	ContractFunctionParameters,
	TokenUpdateTransaction,
	ContractExecuteTransaction,
	AccountCreateTransaction,
	TokenSupplyType,
	TokenType,
	ContractId,
	NftId,
	TokenNftInfoQuery,
	TransferTransaction,
	TokenId,
	TokenAssociateTransaction,
	TransactionRecordQuery,
	TransactionId,
	TokenBurnTransaction,
	TokenWipeTransaction,
	AccountInfoQuery,
	TokenMintTransaction,
} = require("@hashgraph/sdk");
const fs = require("fs");

// 0.0.48638650      0000000000000000000000000000000002e62aba


const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const client = Client.forTestnet().setOperator(operatorId, operatorKey).setMaxQueryPayment(new Hbar(2));
const maxTransactionFee = new Hbar(20);

async function createFungibleToken() {
    const ourToken = await new TokenCreateTransaction()
	.setTokenName("CARD")
	.setTokenSymbol("C")
	.setTokenType(TokenType.FungibleCommon)
	.setDecimals(0)
	.setInitialSupply(100000000)
	.setTreasuryAccountId(operatorId)
	.setAdminKey(operatorKey)
	.setSupplyKey(operatorKey)
		.freezeWith(client)
		.sign(operatorKey)

	const sumbitNFTToken = await ourToken.execute(client)
	const tokenCreateReceipt = await sumbitNFTToken.getReceipt(client)
	const tokenId = tokenCreateReceipt.tokenId
	const tokenIdSolidity = tokenId.toSolidityAddress()

	console.log("Token Id: ", tokenId.toString())
	console.log("As a sol address: ", tokenIdSolidity)
}

async function createCollection(name, symbol) {
    const ourToken = await new TokenCreateTransaction()
	.setTokenName(name)
	.setTokenSymbol(symbol)
	.setTokenType(TokenType.NonFungibleUnique)
	.setDecimals(0)
	.setInitialSupply(0)
		.setTreasuryAccountId(operatorId)
	.setSupplyKey(operatorKey)
		.freezeWith(client)
		.sign(operatorKey)

	const sumbitNFTToken = await ourToken.execute(client)
	const tokenCreateReceipt = await sumbitNFTToken.getReceipt(client)
	const tokenId = tokenCreateReceipt.tokenId
	const tokenIdSolidity = tokenId.toSolidityAddress()

	console.log("NFT Token Id: ", tokenId.toString())
    console.log("As a sol address: ", tokenIdSolidity)
    
    return [tokenId.toString(), tokenIdSolidity]
}

async function mintNft(tokenId, ipfsUrl) {

   try {
	const mintTx = new TokenMintTransaction()
	.setTokenId(tokenId)
	.setMetadata([Buffer.from(ipfsUrl)]) 
	.setMaxTransactionFee(maxTransactionFee)
	.freezeWith(client);

	const mintTxSign = await mintTx.sign(operatorKey);

	const mintTxSubmit = await mintTxSign.execute(client);

	const mintRx = await mintTxSubmit.getReceipt(client);

	console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);
   } catch (error) {
    console.log('error is', error)
   }
}

async function associateToken(tokenId) {

	try {
	let associateTx = await new TokenAssociateTransaction()
	.setAccountId(operatorId)
	.setTokenIds(tokenId)
	.freezeWith(client)
	.sign(operatorKey);

	let associateTxSubmit = await associateTx.execute(client);
	let associateRx = await associateTxSubmit.getReceipt(client);

	console.log(`- Token association with account: ${associateRx.status}`)
	} catch (error) {
	 console.log('error is', error)
	}
}

async function getBalance(accountId, tokenId) {
	let balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountId).execute(client);
	console.log(balanceCheckTx.tokens._map.get(tokenId.toString()).toString())
	return balanceCheckTx.tokens._map.get(tokenId.toString()).toString();
}

async function transferNFT(accountId, privateKey, tokenId, recipientAccountId) {
	try {
	    const tokenTransferTx = await new TransferTransaction()
      .addNftTransfer(
        TokenId.fromString(tokenId),
        7,
        accountId,
        AccountId.fromString(recipientAccountId),
      )
      .freezeWith(client)
      .sign(privateKey);

    const tokenTransferSubmit = await tokenTransferTx.execute(client);
    const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(
      `\n- NFT transfer: ${tokenTransferRx.status} \n`,
	);
	
	const record = await tokenTransferSubmit.getRecord(client);

	console.log("The transaction record is " +record);
	  console.log('NFT token transferred successfully');
	} catch (error) {
	  console.error('Error transferring NFT token:', error);
	}
  }

async function stake(duration) {
	const accountId = operatorId
	const balance = await getBalance(accountId, TokenId.fromString(process.env.C_TOKEN_ID))

	await transferNFT()

	const contractStake = await new ContractExecuteTransaction()
	.setContractId(ContractId.fromString(process.env.FACTORY_CONTRACT_ID))
	.setGas(3000000)
	.setFunction("stake", new ContractFunctionParameters().addUint256(parseInt(duration)).addUint256(parseInt(balance)))
	.setMaxTransactionFee(new Hbar(2))

	const contractStakeExecute = await contractStake.execute(client)
	const contractStakeReceipt = await contractStakeExecute.getReceipt(client)

	console.log("Contract stake was a ", contractStakeReceipt.status.toString())
}

async function unStake() {
	const accountId = operatorId
	const balance = await getBalance(accountId, TokenId.fromString(process.env.C_TOKEN_ID))

	const contractStake = await new ContractExecuteTransaction()
	.setContractId(ContractId.fromString(process.env.FACTORY_CONTRACT_ID))
	.setGas(3000000)
	.setFunction("unStake")
	.setMaxTransactionFee(new Hbar(2))

	const contractStakeExecute = await contractStake.execute(client)
	const contractStakeReceipt = await contractStakeExecute.getReceipt(client)

	console.log("Contract stake was a ", contractStakeReceipt.status.toString())
}
 
async function main() {
// await createFungibleToken()
	const [tokenId, tokenAddress] = await createCollection("Hedera COLLECTION", "HC")
	// console.log(tokenId, tokenAddress)
	// await mintNft(TokenId.fromString('0.0.10618421'), 'https://ipfs.io/ipfs/Qmf4cPi3Le8zWLrmb9EvQwzbjLAstyDJYf1mh5GnLjrgn1')
	// await associateToken(TokenId.fromString('0.0.10618421'))
	// await stake(60)
}
main();