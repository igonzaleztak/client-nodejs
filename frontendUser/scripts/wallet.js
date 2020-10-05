const hostURL = "https://127.0.0.1:8055"

/**
 * Initializes an instance of the contract
 * @param {Object} abi 
 * @param {String} addr
 * @returns Contract 
 */
function initContract(abi, addr)
{
  return new web3.eth.Contract(abi, addr);
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
 * Retrieves information from the Wallet(nodejs server)
 * @param {String} resource 
 * @param {Object} object 
 * @param {callback} callback 
 */
let createXhrRequest =  function (resource, payload, callback)
{
  // Set the path to the resource
  let url = hostURL + resource;
  console.log(url);
  

  // Use XMLHttpRequest to do the request
  let req = new XMLHttpRequest();
  
  // If the request is a GET
  if (payload == null)
  {
    req.open('GET', url);
    req.responseType = 'json';
    req.onload = function() 
    {
      if (req.status == 200) callback(null, req.response);
    };
    req.send(null);
  }
  else 
  {
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(payload));
    req.onload = function()
    {
      if(req.status = 200) callback(null, req.response);
    };
  }
};


/**
 * Gets the purchases of the user
 * @param {Contract} balanceContract 
 * @param {String} account
 * @returns Array of events 
 */
async function payDataEvents(balanceContract, account)
{ 
  let filter = {_addr: account};
  let arrayEvents = await balanceContract.getPastEvents('purchaseNotify', {filter, fromBlock: 0});
  return arrayEvents;
}



/**
 * Shows a modal window which contains the data that the client bought
 * @param {Object} obj 
 */
async function expandObject(obj)
{

  // Initialize the balance contract
  const _balanceAbi = JSON.parse(balanceABI);
  let balanceContract = await initContract(_balanceAbi, balanceAddr);

  // Hash of the data
  let hash =  $(obj).text();
  

  // Account of the user
  let account = document.cookie.split("=")[1]

  // Get the hashes of the transactions that contains the password and the ciphered data
  let filter = 
  {
    _addr: account,
    _hash: hash
  };   
  
  let events = await balanceContract.getPastEvents('responseNotify', {filter, fromBlock:0});
  let evt = events[0];

  // Transaction Hashes for the password and the data
  let transactionSecret = evt.returnValues._txHashExchange;
  let transactionData = evt.returnValues._txHashData;
  
  
  // Show this hashes in the modal window
  document.getElementById("passModal").innerText = transactionSecret;
  document.getElementById("dataModal").innerText = transactionData;

  // Get the input of the data
  createXhrRequest('/input', {hash: hash}, function(err, resp){
    // Parse the response
    let data = JSON.parse(resp);
    
    // Inject the response in the modal window
    document.getElementById("inputModal").innerText = data;

    // Open the modal window
    $('#modalPurchase').modal('show');
    
  });

  
}


/**
 * Gets the latest 3 purchases of the client
 */
async function getOnGoingPurchases()
{

  // Gets user account
  let account = document.cookie.split("=")[1];  

  // Initialize the balance contract
  const _balanceAbi = JSON.parse(balanceABI);
  let balanceContract = await initContract(_balanceAbi, balanceAddr);

  // Check the events generated when the user pays data
  let arrayEvents = await payDataEvents(balanceContract, account);  

  // Check the state of the events and show them on the HTML
  for (let i = (arrayEvents.length - 1); i >= 0; i--) 
  {
    let event = arrayEvents[i];    

    // Hash purchased
    let hash = event.returnValues._hash;

    // Transaction Hash
    let txHash = event.transactionHash;

    // Get the date when the data was purchased
    let blockNumber = event.blockNumber;
    let block = await web3.eth.getBlock(blockNumber);
    let date = convertTimestamp(block.timestamp);    

    // Price
    let price = event.returnValues._value;
    
    // State of the purchase
    let state = await balanceContract.methods.checkHasPaid(account, hash).call();
    

    let img;
    if (state) img = '<img src="images/red.png" height="20"></img>';
    else img = '<img src="images/green.png" height="20"></img>';
    
    // Show event on the HTML
    $('tbody').append("<tr><td>" + date 
    + "</td><td><div style='word-break:break-word;'>" + "<a href='#' onclick=expandObject(this)>" +  hash + "</a>" 
    + "</div></td><td><div style='word-break:break-word;'>" + txHash + "</div></td><td>" + price +"</td><td>" + img +"</td><td></tr>");
  }
  
}

  /** 
   * Buys the information introduced in the input "inputBuy" 
   * */
  async function buyData()
  {
    // Gets user account
    let account = document.cookie.split("=")[1];
    
    // Get the data from the input "inputBuy"
    let hashToBuy = document.getElementById("inputBuy").value;
    
    // Initialize dataContract
    let _dataABI = JSON.parse(dataABI);
    let dataContract = await initContract(_dataABI, dataAddr);

    // Initialize the balance contract
    const _balanceAbi = JSON.parse(balanceABI);
    let balanceContract = await initContract(_balanceAbi, balanceAddr);

    // Check if the element exists
    let info = await dataContract.methods.retrieveInfo(hashToBuy).call();
    
    if (info[0] == "") {
      console.log("Element not found");
      return;
    }

    // Check if it has already been bought by the client
    let eventPurchases = await balanceContract.getPastEvents('responseNotify', 
    {filter:{_hash: hashToBuy, _addr: account}});

    console.log(eventPurchases);
    
    
    if (eventPurchases.length != 0){
      console.log("Element has already been bought");
      return;
    }
    
    // Send the purchase request to the server
    createXhrRequest('/buydata', {hash: hashToBuy}, function(err, resp)
    {
      if(err) throw(err);
      location.reload(); 
    });


  }