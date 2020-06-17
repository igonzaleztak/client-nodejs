const fs = require('fs');

/***************** Global variables *********************/
const folder = "/home/ivan/Desktop/demoPOA2/client-node/keystore";


/***************** Functions *********************/
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
  let match = (dir.filter( fn => fn.match(pattern)))[0];

  let keyJSON = JSON.parse(fs.readFileSync(folder + "/" + match));  

  return keyJSON;
}

/**
 * Recovers the private key of the client
 * @param {Web3} web3
 * @param {String} account 
 * @param {String} password
 * @return {String} privateKey 
 */
function getPrivateKey(web3, account, password)
{
  // Get the UTC file that has the parameters to extract the 
  // private key   
  let pattern = new RegExp(".*" + account.substring(2), "i");
  let keyJSON;
  try {
    keyJSON = getFilesFromPath(folder, pattern);
  } catch (err) {
    return null;
  }

  return (web3.eth.accounts.decrypt(keyJSON, password)).privateKey;
}

module.exports = {
  getPrivateKey
}