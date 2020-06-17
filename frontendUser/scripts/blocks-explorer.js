const hostURL = "https://127.0.0.1:8055"


async function getLastBlockNumber() {
  let number = await web3.eth.getBlockNumber();
  return number;
}

/**
 * Converts de timestamp in seconds to date
 * @param {Number} time 
 * @returns date in format hh:mm:ss dd-mm-yyyy
 */
function convertTimestamp(time) 
{
  let d = new Date(time * 1000);
  let yyy = d.getFullYear();
  let mm = ('0' + (d.getMonth() + 1)).slice(-2);
  let dd = ('0' + d.getDate()).slice(-2);
  let hh = d.getHours();
  let min = ('0' + d.getMinutes()).slice(-2);
  let sec = ('0' + d.getSeconds()).slice(-2);

  let convTime = hh + ':' + min + ':' + sec + '  ' + dd + '-' + mm + '-' + yyy;

  return convTime
}


/**
 * Gets the block number of an innerHTML
 * @param {String} exp 
 * @returns Number of the block
 */
function getNumber(exp)
{
  let pattern = /<td>(\d+)<\/td>/;
  let match = pattern.exec(exp);

  return match[1];
}

/**
 * Retrieves information from the Wallet(nodejs server)
 * @param {String} resource 
 * @param {Object} object 
 * @param {callback} callback 
 */
let creatXhrRequest =  function (resource, object, callback)
{
  // Set the path to the resource
  let url = hostURL + resource;
  console.log(url);
  

  // Use XMLHttpRequest to do the request
  let req = new XMLHttpRequest();
  
  // If the request is a GET
  if (object == null)
  {
    req.open('GET', url);
    req.responseType = 'json';
    req.onload = function() 
    {
      if (req.status == 200)
      {         
      callback(null, req.response);
      }
    };
    req.send(null);
  }
}

/**
 * Gets the last 5 blocks
 */
async function getBlockInfo() 
{
  // Get the number of the last block
  let lastBlock = await getLastBlockNumber();

  // Get the last 5 blocks of the blockchain
  for (var i = lastBlock; i > (lastBlock - 5); i--) 
  {
    let txObject = await web3.eth.getBlock(i);

    let blockHash = txObject.hash;
    let blockNum =  txObject.number;
    let timeStamp = convertTimestamp(txObject.timestamp);    

    $('tbody').append("<tr><td>" + blockNum + "</td><td>" + timeStamp + "</td><td>" + blockHash + "</td><td>");
  }

}

/**
 * Gets all the transactions from a block
 */
async function getTransactionsFromBlock()
{
  // Get the transactions
  let blockHash = "" + document.getElementById("blockHashInput").value;
  let block = await web3.eth.getBlock(blockHash);
  let arrayTransactions = block.transactions;

  // Tag where the transactions will be appended
  let parent = document.getElementById("returnTransactions");

  // Remove all childs before adding new ones
  if (parent.hasChildNodes()) parent.innerHTML = '';
  
  // Append the transactions as childs of the parent node
  arrayTransactions.forEach(element => {
    let text = "<br>" +  element + "<br>";
    parent.insertAdjacentHTML('beforeend', text);
  });
}


/**
 * Gets the info of the transaction: Input and From
 */
async function getTransactionInfo()
{
  // Recover the receipt of the transaction
  let txHash = "" + document.getElementById('txHashInput').value;
  let transaction = await web3.eth.getTransaction(txHash);
  
  // Attributes that will be showd in the HTML
  let from = transaction.from;
  let input = transaction.input;
  let _hash = transaction.hash;
  
  // Get the HTML elements where the text will be showed
  document.getElementById('txHash').innerText = _hash;
  document.getElementById('txFrom').innerText = from;
  document.getElementById('txInput').innerText = input;
}