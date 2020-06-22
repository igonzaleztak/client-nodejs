const Web3 = require('web3');
const net = require('net');
const blockchain = require('./libs/blockchain.js');
const access = require('./libs/accessControl.js');
const fs = require('fs');
const Wallet = require('ethereumjs-wallet');
const readline = require('readline-sync');


const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const eciesjs = require('eciesjs');


const axios = require('axios');
const https = require('https');
const { log } = require('console');


/***************** Global variables *********************/

// Connection with node of the client
const gethPath = '/home/ivan/Desktop/demoPOA2/client-node/geth.ipc'
const web3 = new Web3(gethPath, net);

// Folder where the private key is kept
const folder = "/home/ivan/Desktop/demoPOA2/client-node/keystore/"

const clientAddr = "0x5bab040bc593f57eda64ea431b14f182fe167f3f";
//const X = "1a4a0cc72c5e728016ba8f7abfe0d1ee34ee71e2a96a7029c3954e9fc2f58eb3";
const X = "19c52b1fc673cddfa42eceebf4839adb71e951de404f810bbcd7c98f47996cd6";

// URL of the server
//const serverHost = 'http://127.0.0.1:5051/'
const serverHost = 'https://127.0.0.1:8051/'

// The following line is to accept TLS connections with self-signed certificates
const agent = new https.Agent({ rejectUnauthorized: false });


/******************** Functions ************************/

/**
 * Parses text from format1('from') to format2('to')
 * E.g: to parseFormat string to hex
 *       hex = parseFormat(text, 'utf8', 'hex')
 * @param {String} text 
 * @param {String} from 
 * @param {String} to 
 * @return {String}
 */
function parseFormat(text, from, to) {
  return Buffer.from(text, from).toString(to);
}

/**
 * Logs in to the ethreum account
 * @return {String} privateKey of the user
 * @return {String} publicKey of the user
 */
async function loginAccount() {
  let privateKey = "";
  let publicKey = "";

  // Login the client by getting his private and public key
  let password = "" + readline.question("Introduce password:\n");
  console.log("\nLogin into the account, please wait");
  try {
    privateKey = access.getPrivateKey(web3, clientAddr, password);
    publicKey = access.getPublicKey(privateKey);
    console.log("Login Correct");
  }
  catch (error) {
    console.log("Login Incorrect");
    console.log(error);
    process.exit();
  }

  return [privateKey, publicKey];
}


/**
 * Converts Uint8Array to hex string
 * @param {Uint8Array} arrayBuffer 
 */
function buf2hex(arrayBuffer) 
{
  let buff = new Uint8Array(arrayBuffer);
  return Buffer.from(buff).toString('hex');
}


/**
 * Signs the hash of the message
 * @param {String} message 
 * @param {String} privateKey 
 * @returns {Object} hash signed
 */
function ecdsaSign(message, privateKey) 
{
  // Hash the message and sign it
  let hash = crypto.createHash('SHA256').update(message).digest(); 
  let sig =  secp256k1.ecdsaSign(hash, Buffer.from(privateKey, 'hex'));  
  return sig;
}

/********************* MAIN FUNCTION **************************************/
async function main() {
  // Login into the client's account and returns his keys
  const [privateKey, publicKey] = await loginAccount();
  
  // Balance Contract
  const balanceContract = await blockchain.initContract(web3
    , blockchain.balanceABI
    , blockchain.balanceContractAddress);

  // AccessContract
  const accesContract = await blockchain.initContract(web3
    , blockchain.accessControlABI
    , blockchain.accessControlAddr);

  // Check if the user has already stored his public key in the blockchain
  let keyStored = await accesContract.methods.getPubKey(web3.utils.toChecksumAddress(clientAddr)).call();
    
  if (keyStored == "") 
  {
    console.error("The user has not stored his public key yet");

    // Store the client's public key in the blockchain
    await blockchain.sendTransactionContract(web3, accesContract.methods.addPubKey(publicKey), privateKey)
    .catch(err => {throw (err)});
  }  
  
  // Get the price of X
  let price = await balanceContract.methods.getPriceData("0x" + X).call()
  .catch((err) => {throw (err)});

  console.log("Price of X: ", price);
  if (price == 0) process.exit();

  // Check if X has already been bought
  let filter =
  {
    _addr: web3.utils.toChecksumAddress(clientAddr),
    _hash: "0x" + X
  };

  // Get all the events that matches the previous filter
  let events = await balanceContract.getPastEvents('purchaseNotify', { filter, fromBlock: 0 })
  .catch((err) => { throw (err) });  

  // If there is not an event, It means that this account has not bought the measurement yet
  if (events.length == 0) 
  {
    // Buy X
    await blockchain.sendTransactionContract(web3, balanceContract.methods.payData(Buffer.from(X, 'hex')), privateKey)
    .catch((err) => {
      console.log(err);
      process.exit();
    });
  }

  // Do the signature of the data PrKey(hash + timestamp)
  let message = clientAddr.substring(2) + X;
  let signature = (ecdsaSign(message, privateKey.substring(2))).signature;  

  // Send the info to the server so it can process the purchase
  let body =
  {
    _hash: "0x" + X,
    _account: clientAddr,
    _signature: "0x" + buf2hex(signature)
  }
  console.log("\n\nBody of the message:");
  console.log(body);
  console.log("\n");
  
  
  // Send POST request to the server to get the measurement
  await axios.post(`${serverHost}buydata`, JSON.stringify(body), { httpsAgent: agent })
  .then(async function (response) {
    // Retrieve the measurement from the response
    let measurement = response.data;
    let hashBought = (JSON.parse(measurement.attrMd))[0].value;
    console.log("\n\nMeasurement Bought:\n");
    console.log(measurement);
    

    // Check if the client has already confirmed the measurement
    let filter =
    {
      _addr: web3.utils.toChecksumAddress(clientAddr),
      _hash: "0x" + X
    };

    // Get the event that holds the acknowledge of the purchase
    let ack = (await balanceContract.getPastEvents('ackPurchase', {filter, fromBlock:0}));

    // Check if the measurement has already been confirmed
    if (ack.length != 0 ) return;
    
    // Check whether the measurement received is one which was bought or not
    if (hashBought !== X) return;

    // Confirm the measurement
    await blockchain.sendTransactionContract(web3, balanceContract.methods.confirmData(Buffer.from(X, 'hex')), privateKey)
    .catch(err => {
      console.log(err);
      process.exit();
    });

  })
  .catch(async function (err) {
    console.log(err);
  });

  process.exit();
}

main();

