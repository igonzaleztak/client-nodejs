const fs = require('fs')
const Wallet = require('ethereumjs-wallet');
const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const eciesjs = require('eciesjs');
const Web3 = require('web3');
const net = require('net');

const axios = require('axios');
const https = require('https');
const blockchain = require('../libs/blockchain.js');
const { Eth } = require('web3-eth');



/***************** Global variables *********************/
const gethPath = '/home/ivan/Desktop/demoPOA2/client-node/geth.ipc';
const web3 = new Web3(gethPath, net);

const clientAddr = "0x9ebbb19c78b9a553c837af8e13037856aec76b6d";
const password = "1";

const X ="696f742d736d61727473616e74616e6465723100000000000000000000000000";
const folder = '/home/ivan/Desktop/demoPOA2/client-node/keystore/';

// The following line is to accept TLS connections with self-signed certificates
const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

/******************** Functions ************************/
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
 * Send signed transaction to contract method
 * @param {Web3} web3 
 * @param {ContractTransaction} transaction 
 * @param {String} privKey 
 */
async function sendTransactionContract(web3, transaction, privKey)
{
  let options =  
  {
    to: 			transaction._parent._address,
    data: 		transaction.encodeABI(),
    gasPrice: '0',
    gas:	4000000
  };

  let signedTransaction = await web3.eth.accounts.signTransaction(options, privKey);
  let receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
  .catch((err) => {
    throw(err);
  });
  return receipt;
}

/**
 * Get the file, which contains the parameters to extract the
 * private key of an ethereum account.
 * @param {String} path 
 * @param {String} pattern
 * @return {String} 
 */
function getFilesFromPath(path, pattern)
{
  let dir = fs.readdirSync(path);
  return dir.filter( fn => fn.match(pattern));
}

/**
 * Gets the private key of the client
 * @param {String} password
 * @return {String} private key and public key
 */
async function getClientKeys(password) {
  // Get the UTC file that has the parameters to extract the 
  // private key 
  let pattern = new RegExp(".*" + clientAddr.substring(2), "i");
  let utcFile = "" + folder + getFilesFromPath(folder, pattern)[0];

  // Get the wallet associated to the client's account
  let clientWallet = await Wallet.default.fromV3(fs.readFileSync(utcFile).toString(), password, true);

  return [clientWallet.getPrivateKey().toString('hex'), clientWallet.getPublicKey().toString('hex')]
}


/**
 * Extract the Token from an event
 * @param {Web3} web3 
 * @param {Event} event 
 * @return {String} tokenString
 */
async function processEvent(web3, event)
{
  // Get transaction hash from the event
  let txHash = event.returnValues._txhahs;
  //TODO: Change indexed parameter name in Balance SC

  // Get the token from the transaction
  let tx = await web3.eth.getTransaction(txHash);
  let tokenString = web3.utils.hexToUtf8(tx.input);

  return tokenString;
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
  let sig = secp256k1.ecdsaSign(hash, Buffer.from(privateKey, 'hex'))
  return sig;
}


/**
 * Cashes the token in the measurement broker and, as a result of this,
 * obtains the value of the measurement
 * @param {Object} tokenObject 
 */
async function postToken(tokenObject)
{
  let returnedValue;
  let bearerToken = parseFormat(JSON.stringify(tokenObject), 'utf8', 'base64');

  await instance.get(tokenObject.url, {headers: { Authorization : 'Bearer ' + bearerToken}})
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {console.log(err.response.data);});
}

/**
 * Listens the events emmitted by the Balance Contract
 * @param {Web3} web3 
 * @param {BalanceContract} balanceContract 
 */
async function listenToSubs(web3, balanceContract, privKey)
{
  let filter = {
    _addr: web3.utils.toChecksumAddress(clientAddr)
  };
  let i = 1;
  balanceContract.events.sendTokenEvent({filter}, async function(error, event) {
    if (error) throw(error);
    console.log("\nEvent %d\n", i);
    i++;

    // Get the token from the input of the transaction
    let tokenString = await processEvent(web3,event)

    // Sign the token to cash it in the measurement Broker
    let tokenSignature = (ecdsaSign(tokenString, privKey)).signature;

    // Parse the token string to Object
    let tokenObj = JSON.parse(tokenString);

    // Add the signature to the token
    tokenObj.signature = "0x" + buf2hex(tokenSignature);

    // Post the token to the measurements broker
    await postToken(tokenObj);
  });
}


async function main() 
{
  console.log("Testing client");
  
  // Unlock account: Get private key
  let [clientPrivKey, clientPubKey] = await getClientKeys(password);

  // Balance Contract
  const balanceContract = await blockchain.initContract(web3
    , blockchain.balanceABI
    , blockchain.balanceContractAddress);

  // Get all types available in Balance SC
  let allTypes = await balanceContract.methods.getAllTypes().call();

  console.log(allTypes);

  // Check wheter the user is already subscribed to the type
  let [isSubscribed, expirationDate] = await balanceContract.methods.checkSubStatus(Buffer.from(X, 'hex'), web3.utils.toChecksumAddress(clientAddr)).call({
    from: clientAddr
  });

  if (!isSubscribed || expirationDate < Date.now()) 
  {
    await sendTransactionContract(web3, balanceContract.methods.subscribeTo(Buffer.from(X, 'hex'), 3600), clientPrivKey)
    .catch((err) => {
      throw(err);
    });
    console.log("client was successfully subscribed");
  }


  // Subscribe to one type(X)
  /*
  await sendTransactionContract(web3, balanceContract.methods.subscribeTo(Buffer.from(X, 'hex'), 3600), clientPrivKey)
  .catch((err) => {
    throw(err);
  });
  console.log("client was successfully subscribed");
  */
  
  console.log(status);

  // Listen to subscriptions
  await listenToSubs(web3, balanceContract, clientPrivKey);

}

main()