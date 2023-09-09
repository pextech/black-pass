const {
	Client,
	AccountId,
	PrivateKey,
	ContractCreateFlow,
	AccountCreateTransaction,
	ContractCreateTransaction,
	Hbar,
	ContractExecuteTransaction,
	ContractId,
	ContractCallQuery,
	ContractFunctionParameters
} = require('@hashgraph/sdk');
const fs = require('fs');
// const { hethers } = require('@hashgraph/hethers');
require('dotenv').config();
const Web3 = require('web3');

// Get operator from .env file
const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const abi = require('./blackPass.json');

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
  
  async function getSetting(fcnName, contractId) {
	const functionCallAsUint8Array = await encodeFunctionCall(fcnName, []);
	const contractCall = await new ContractCallQuery()
	  .setContractId(ContractId.fromString(contractId))
	  .setFunctionParameters(functionCallAsUint8Array)
	  .setMaxQueryPayment(new Hbar(2))
	  .setGas(100000)
	  .execute(client);
	const queryResult = await decodeFunctionResult(fcnName, contractCall.bytes);
	console.log(queryResult['0'].toString())
	return queryResult['0'].toString()
  }
  

async function contractDeployFcn(bytecode, gasLim) {
	const contractCreateTx = new ContractCreateFlow().setBytecode(bytecode).setGas(gasLim);
	const contractCreateSubmit = await contractCreateTx.execute(client);
	const contractCreateRx = await contractCreateSubmit.getReceipt(client);
	const contractId = contractCreateRx.contractId;
	const contractAddress = contractId.toSolidityAddress();
	return [contractId, contractAddress];
}


async function createBlackPass(contractId) {

	const contractCreateBlackPass= await new ContractExecuteTransaction()
	.setContractId(ContractId.fromString(contractId))
	.setGas(3000000).setPayableAmount(20)
	.setFunction("createBlackPassCollection", new ContractFunctionParameters().addString('Black pass').addString('BP').addString('creating Black pass collection').addInt64(10000))
	.setMaxTransactionFee(new Hbar(2))

	const contractStakeExecute = await contractCreateBlackPass.execute(client)
	const contractStakeReceipt = await contractStakeExecute.getReceipt(client)

	console.log("Contract add black pass was a ", contractStakeReceipt.status.toString())

	const blackPassCollection = await getSetting('blackPassCollection', contractId);
	
	console.log("Token generated", blackPassCollection)

}

async function addTier(contractId, tierName) {

	const contractCreateTier= await new ContractExecuteTransaction()
	.setContractId(ContractId.fromString(contractId))
	.setGas(3000000)
	.setFunction("addTier", new ContractFunctionParameters().addString(tierName))
	.setMaxTransactionFee(new Hbar(2))

	const contracttierExecute = await contractCreateTier.execute(client)
	const contractStierReceipt = await contracttierExecute.getReceipt(client)

	console.log("Contract add tier was a ", contractStierReceipt.status.toString())

}

const main = async () => {

	// const json = JSON.parse(fs.readFileSync('./MuseumFactory.json'));

    // const contractBytecode = json.bytecode;
    
    const bytecode = fs.readFileSync("./factory.bin")

	console.log('\n- Deploying contract...');
	const gasLimit = 1200000;

	const [contractId, contractAddress] = await contractDeployFcn(bytecode, gasLimit);

	console.log(`Contract created with ID: ${contractId} / ${contractAddress}`);
	await createBlackPass(contractId.toString())

	await Promise.all(
		[1, 2].map(async(each) => {
			await addTier(contractId.toString(), `tier-${each}`)
		})
	)
	

};

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});