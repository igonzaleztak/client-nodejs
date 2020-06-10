const Web3 = require('web3');
const blockchain = require('../libs/blockchain.js');
const net = require('net');

//const gethPath = '/home/ivan/Desktop/scripted-IBFT-network/new-node/geth.ipc';
const gethPath = '/home/ivan/Desktop/demoPOA2/new-node/geth.ipc';
const web3 = new Web3(gethPath, net);
const adminAcc = "0x21A018606490C031A8c02Bb6b992D8AE44ADD37f"

async function unlockAccount(web3) {
  await web3.eth.personal.unlockAccount(adminAcc, "1");
}

async function deployContract(abi, bytecode, contractName) 
{
  let myContract = new web3.eth.Contract(abi);
  let contractData = "0x" + bytecode;

  myContract.deploy({
    data: contractData
  })
  .send({
    from: adminAcc,
    gas:  4000000,
    gasPrice: 0
  })
  .on('receipt', function(receipt){
    console.log("The address of " + contractName + " is: " + receipt.contractAddress);
  });
}

async function main()
{
  // Unlock the first account
  await unlockAccount(web3);  

  // Get the address of data contract
  let abi = blockchain.contractLedgerAbi;
  let bytecode = blockchain.contractLedgerBytecode;
  await deployContract(abi, bytecode, "data_contract")

  // Get address of access contract
  abi = blockchain.accessControlABI;
  bytecode = blockchain.accessControlBytecode;
  await deployContract(abi, bytecode, "access_contract")

  // Get the address of balance contract
  abi = blockchain.balanceABI;
  bytecode = blockchain.balanceBytecode;
  await deployContract(abi, bytecode, "balance_contract")

}

main();