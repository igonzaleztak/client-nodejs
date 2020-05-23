const blockchain = require('./libs/blockchain.js');
const Web3 = require('web3');
const net = require('net');

/***************** Global variables *********************/
const gethPath = '/home/ivan/Desktop/demoPOA2/new-node/geth.ipc';
const web3 = new Web3(gethPath, net);
const adminAcc = web3.utils.toChecksumAddress('0x21A018606490C031A8c02Bb6b992D8AE44ADD37f')

/******************** Functions ************************/

async function grantAccess()
{
  // Unlock the first account to grant access to accounts
  await web3.eth.personal.unlockAccount(adminAcc, "1");

  // Account add and its associated ID
  let producerAcc = "0xc9585bB6fb2521f3630b2bE104e43dB394fd1DB4";
  let producerID  = web3.utils.fromAscii("sensor1");

  // Initialize the access contract
  let accessContract = blockchain.initContract(web3
    , blockchain.accessControlABI
    , blockchain.accessControlAddr)
  
  // Add producer account to the contract
  await accessContract.methods.addAccountToRegister(producerID, producerAcc)
  .send({
    from: adminAcc,
    gas: 4000000,
    gasPrice: 0
  });  

  // Check if the account was added
  let addr =  await accessContract.methods.getAddress(producerID).call()
  console.log("Registered address: " + addr);
  
  process.exit()
}

grantAccess();