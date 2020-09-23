const fs = require('fs');
const eciesjs = require('eciesjs');
const Wallet = require('ethereumjs-wallet');
const crypto = require('crypto');
const https = require('https');
const secp256k1 = require('secp256k1');
const axios = require('axios');


const blockchain = require('../libs/blockchain');


/***************** Global variables ***************************************************/
const folder = "/home/ivan/Desktop/demoPOA2/client-node/keystore/";
const serverHost = 'http://127.0.0.1:5051/'

// The following line is to accept TLS connections with self-signed certificates
const agent = new https.Agent({ rejectUnauthorized: false });

/******************************** Functions *******************************************/
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
function parseFormat(text, from, to)
{
  return Buffer.from(text, from).toString(to);
}

/**
 * Gets the public key of the client from his private key
 * @param {String} privateKey 
 * @return {String} publicKey
 */
function getPublicKey(privateKey)
{
  let privateKeyBuffer =Buffer.from(privateKey.substring(2), 'hex');
  let wallet = Wallet.default.fromPrivateKey(privateKeyBuffer);
  
  return wallet.getPublicKey().toString('hex');
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
 * Signs the hash of the message
 * @param {String} message 
 * @param {String} privateKey 
 * @returns {Object} hash signed
 */
function ecdsaSign(message, privateKey) 
{
  // Hash the message and sign it
  let hash = crypto.createHash('SHA256').update(message).digest(); 
  let sig = secp256k1.ecdsaSign(hash, Buffer.from(privateKey.substring(2), 'hex'))
  return sig;
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


/************************ MAIN  ************************************/
/**
 * Deciphers the input of the transaction and sends it to the client
 * @param {JSON.Stringify} body 
 * @param {String} account 
 * @param {String} privateKey 
 * @param {Contract} balanceContract 
 * @param {Web3} web3 
 * @param {res} res 
 */
async function getInput(body
  , account
  , privateKey
  , balanceContract
  , web3
  , res)
{
  let hash = JSON.parse(body).hash;

  // Get the event that holds the payment
  let filter = 
  {
    _addr: account,
    _hash: hash
  };  
  
  balanceContract.getPastEvents('responseNotify', {filter, fromBlock:0}, async function (err, events)
  {
    if (err)
    {
      let error = new Error("Could not find the event")
      res.status = 401;
      return next(error);
    }

    let evt = events[0];

    // Get the hashes of the transactions that contain the secret and the encrypted data
    txSecretHash = events[0].returnValues._txHashExchange;
    txDataHash = events[0].returnValues._txHashData;

    // Get the value of the measurement
    let measurement = await decryptMeasurement(web3, txSecretHash, txDataHash, privateKey);

    res.json(measurement);
    res.end();
  });
}


/**
 * Function used by the client to purchase a measurement
 * @param {String} body 
 * @param {String} clientAddr 
 * @param {String} privateKey 
 * @param {Contract} balanceContract 
 * @param {Contract} accesContract
 * @param {Web3} web3
 * @param {Express.response} resp 
 */
async function buyData(bodyReq, clientAddr, privateKey, balanceContract, accesContract, web3, resp)
{
  // Get the hash of the info
  let X = (JSON.parse(bodyReq).hash).substring(2); 

  // Do the signature of the data PrKey(hash + timestamp)
  let message = clientAddr.substring(2) + X;
  let signature = (ecdsaSign(message, privateKey)).signature;

  // Check if the user has already stored his public key in the blockchain
  let keyStored = await accesContract.methods.getPubKey(web3.utils.toChecksumAddress(clientAddr)).call();
  if (keyStored == "") {
    console.error("The user has not stored his public key yet");
    
    // Get the public key
    let publicKey = getPublicKey(privateKey);

    // Store the client's public key in the blockchain
    await blockchain.sendTransactionContract(web3, accesContract.methods.addPubKey(publicKey), privateKey)
    .catch(err => {throw (err)});

  }  

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
    // Get the price of the data
    let price = await balanceContract.methods.getPriceData("0x" + X).call();
    
    await blockchain.sendTransactionContract(web3, balanceContract.methods.payData(Buffer.from(X, 'hex'), price), privateKey)
    .catch((err) => {
      console.log(err);
      resp.sendStatus(405);
      resp.end();
      return ; 
    });
  }
  // Check if the producer has already paid the data
  let array = await balanceContract.getPastEvents('responseNotify', {filter, fromBlock: 0});  
  if (array.length != 0) 
  {
    resp.sendStatus(200);
    resp.end();
    return ; 
  }

  
  // Query the server to indicate that the data has been bought
  await axios.post(`${serverHost}buydata`, JSON.stringify(body), { httpsAgent: agent })
  .catch(async function (err) {
    console.log(err);
    resp.sendStatus(500)
  });
    
  // Successful response
  resp.sendStatus(200);
  resp.end();
}

module.exports = 
{
  getInput,
  buyData
}