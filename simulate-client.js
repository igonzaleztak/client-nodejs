const Web3 = require('web3');
const net = require('net');
const blockchain = require('./libs/blockchain.js');
const fs = require('fs');
const Wallet = require('ethereumjs-wallet');
const readline = require('readline-sync');


const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const eciesjs = require('eciesjs');


const axios = require('axios');
const https = require('https');


/***************** Global variables *********************/

// Connection with node of the client
const gethPath = '/home/ivan/Desktop/demoPOA2/client-node/geth.ipc'
const web3 = new Web3(gethPath, net);

// Folder where the private key is kept
const folder = "/home/ivan/Desktop/demoPOA2/client-node/keystore/"

const clientAddr = "0x5bab040bc593f57eda64ea431b14f182fe167f3f";
const X = "a01d72423f813f32142b5dea22c891aedff507353b30efb8ab1464facba5f81a";

// URL of the server
//const serverHost = 'http://127.0.0.1:5051/'
const serverHost = 'https://127.0.0.1:8051/'

// The following line is to accept TLS connections with self-signed certificates
const agent = new https.Agent({ rejectUnauthorized: false });


/******************** Functions ************************/

/**
 * Unlocks the client's account
 * @param {String} password 
 */
async function unlockAccount(password) {
  await web3.eth.personal.unlockAccount(String(clientAddr), String(password), 600)
    .catch((error) => {
      throw (error);
    });

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
function getClientKeys(password) {
  // Get the UTC file that has the parameters to extract the 
  // private key 
  let pattern = new RegExp(".*" + clientAddr.substring(2), "i");
  let utcFile = "" + folder + getFilesFromPath(folder, pattern)[0];

  // Get the wallet associated to the client's account
  let clientWallet = Wallet.fromV3(fs.readFileSync(utcFile).toString(), password, true);

  return [clientWallet.getPrivateKey().toString('hex'), clientWallet.getPublicKey().toString('hex')]
}

/**
 * Logs in to the ethreum account
 * @return privateKey of the user
 */
async function loginAccount() {
  let privateKey = "";
  let publicKey = "";

  // Login the client
  let password = "" + readline.question("Introduce password:\n");
  console.log("\nLogin into the account, please wait");
  try {
    [privateKey, publicKey] = getClientKeys(password);
    console.log("Login Correct");

    // Once the client has logged in, he unlocks the account
    // in the blockchain
    await unlockAccount(password);
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

/**
 * Decrypts a message encrypted with AES-256-GMC
 * @param {Buffer} key 
 * @param {Buffer} secret 
 */
async function decryptAES(key, secret)
{
  // Constant variables
  const ivSize = 12;
  const tagSize = 16;
  
  // Get the IV
  let iv = secret.slice(0, ivSize);  

  // Get the ciphertext 
  let ciphertext = secret.slice(ivSize, secret.length - tagSize);
  
  // Get the authentication tag
  let tag = secret.slice(secret.length - tagSize, secret.length)

  // Decrypt the text
  let decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);  
  decipher.setAuthTag(tag)
  let plaintext = decipher.update(ciphertext, null, 'utf8');
  plaintext += decipher.final('utf8')

  return plaintext
}

/**
 * Check whether the data has been given to the client or not
 * @param {Web3} web3
 * @param {Contract} balanceContract
 * @returns {Boolean} True or false
 * @returns {String} txSecretHash
 * @returns {String} TxDataHash
 */
async function checkIfDataHasBeenGiven(web3, balanceContract) 
{
  // Look for the event in the blockchain
  let filter = {
    _addr: web3.utils.toChecksumAddress(clientAddr),
    _hash: "0x" + X
  }
  let events = await balanceContract.getPastEvents("responseNotify", {filter, fromBlock: 0})
  .catch((err) => {throw (err)});

  if (events.length == 0){
    return [false, null, null]
  }

  // Get the hashes of the transactions that contain the secret and the encrypted data
  txSecretHash = events[0].returnValues._txHashExchange;
  txDataHash = events[0].returnValues._txHashData;

  return [true, txSecretHash, txDataHash]
}


/**
 * Decrypts the measurement that the client has purchase
 * @param {web3} web3
 * @param {String} txSecretHash 
 * @param {String} txDataHash 
 * @param {Buffer} privateKey
 * @returns {returns} measurement in plain text
 */
async function decryptMeasurement(web3, txSecretHash, txDataHash, privateKey)
{    
  // Get the transaction data of these hashes
  let txSecret = (await web3.eth.getTransaction(txSecretHash)
  .catch((err) => {throw(err)})).input;
  let txData = (await web3.eth.getTransaction(txDataHash)
  .catch((err) => {throw(err)})).input

  // Convert the input to Object
  let encryptedSecret = (JSON.parse(parseFormat(txSecret.substring(2), 'hex', 'utf8'))).ClientSecret;

  // Decrypt the secret using the private key
  let key = eciesjs.decrypt(privateKey, Buffer.from(encryptedSecret, 'base64'));

  // Use the key to decipher the measurement
  let plain = decryptAES(key, Buffer.from(txData.substring(2), 'hex'));  

  return plain
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
  if (keyStored == "") {
    console.error("The user has not stored his public key yet");

    // Store the client's public key in the blockchain
    await accesContract.methods.addPubKey(publicKey).send({
      from: clientAddr,
      gasPrice: '0',
      gas: 400000
    }).catch((err) => { throw (err) });
  }  
  

  // Get the price of X
  let price = await balanceContract.methods.getPriceData("0x" + X).call()
  .catch((err) => {throw (err)});
  console.log("Price of X: ", price);
  if (price == 0) {
    process.exit()
  }

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
    await balanceContract.methods.payData(Buffer.from(X, 'hex')).send({
      from: clientAddr,
      gasPrice: '0',
      gas: 400000
    }).catch((err)=>{throw (err)});
  }

  // Do the signature of the data PrKey(hash + timestamp)
  let message = clientAddr.substring(2) + X;
  let signature = (ecdsaSign(message, privateKey)).signature;  

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
  .then(function (response) {
    // Retrieve the measurement from the response
    let measurement = response.data;
    console.log("\n\nMeasurement Bought:\n");
    console.log(measurement);
    
  })
  .catch(async function (err) {
    console.log(err);
  });

  process.exit();
}

main();

