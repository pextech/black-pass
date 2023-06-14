
require("dotenv").config();
const {
	Client,
	AccountId,
	PrivateKey,
	Hbar,
	AccountCreateTransaction,
	AccountInfoQuery,
} = require("@hashgraph/sdk");
const fs = require("fs");

const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.PRIVATE_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey).setMaxQueryPayment(new Hbar(2));
console.log(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY)

async function main() {

    const accountPrivateKey = PrivateKey.generateECDSA()

    // console.log(accountPrivateKey.toStringRaw())

   const accountCreateTx = await new AccountCreateTransaction()
		.setKey(accountPrivateKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
		.execute(client)

	const AccountCreateReceipt = await accountCreateTx.getReceipt(client)
	const accountId = AccountCreateReceipt.accountId
	const Sol = accountId.toSolidityAddress()

	console.log(accountPrivateKey.toStringRaw(), accountId.toString())

}
main();
