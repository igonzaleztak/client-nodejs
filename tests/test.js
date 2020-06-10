const fs = require('fs')
const Wallet = require('ethereumjs-wallet');
const crypto = require('crypto');
const eciesjs = require('eciesjs');
const Web3 = require('web3');
const net = require('net');



/***************** Global variables *********************/
const gethPath = '/home/ivan/Desktop/demoPOA2/new-node/geth.ipc';
const web3 = new Web3(gethPath, net);

const clientAddr = "0x5bab040bc593f57eda64ea431b14f182fe167f3f";

/******************** Functions ************************/

/**
 * Gets the private key of the client
 * @param {String} password
 * @return {String} private key and public key
 */
function getClientKeys(password) {
  // File in which the elements to obtain the private key are stored
  let utcFile = "producer-keystore";
  let clientWallet = Wallet.fromV3(fs.readFileSync(utcFile).toString(), password, true);

  return [clientWallet.getPrivateKey().toString('hex'), clientWallet.getPublicKey().toString('hex')]
}

async function main() 
{

  // Get the private key of the client
  let [privKey, pubKey] = getClientKeys("1")

  // Message to encrypt
  let msg = "1"

  let encrypted = eciesjs.encrypt(pubKey, Buffer.from(msg));
  console.log(encrypted.toString('hex'));

  let plain = eciesjs.decrypt(privKey, encrypted);
  console.log(plain)

}

main()