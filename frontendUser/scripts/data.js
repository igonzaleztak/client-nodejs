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
 * Removes the those events whose hash is duplicated
 * @param {Array} events 
 * @returns Array without duplicated events
 */
function removeSameHash(events)
{
  // Create an associative array
  let noDupObj = {}

  // Put Objects Into As Associative Array
  for (let i = 0; i < events.length; i++)
  {
    let evt = events[i];
    noDupObj[evt.returnValues._hash] = evt;
  }  

  // Reconstruct the list without the duplicated events
  let i = 0;
  let nonDuplicatedEventsArray = [];
  
  for (let item in noDupObj)
  {
    nonDuplicatedEventsArray[i++] = noDupObj[item];
  }

  return nonDuplicatedEventsArray;
  
}


/**
 * Gets all the events 'storeInfo' from the data contract
 * @param {Contract} contract 
 * @returns Array of events
 */
async function getDataEvents(contract)
{
  // Get all the past events
  let eventArray = await contract.getPastEvents('evtStoreInfo', {fromBlock : 0});  

  // Remove the duplicated events
  let array  = removeSameHash(eventArray);

  return array;
} 


/**
 * Gets the data stored in the blockchain
 */
async function getData()
{
  // Initialize the data contract
  let _dataABI = JSON.parse(dataABI);
  let dataContract = initContract(_dataABI, dataAddr);

  // Initialize balanceContract
  let _balanceABI = JSON.parse(balanceABI);
  let balanceContract = initContract(_balanceABI, balanceAddr);  

  let eventsArray = await getDataEvents(dataContract);

  // Represent the events in the HTML
  for (let i = (eventsArray.length - 1); i >= 0; i--)
  {
    
    // Get the hash of the event
    let eventHash = eventsArray[i].returnValues._hash;

    // Get the time of the event
    let blockHash = eventsArray[i].blockHash
    let time = (await web3.eth.getBlock(blockHash)).timestamp    

    // Get all the information associated to the hash
    let info = await dataContract.methods.retrieveInfo(eventHash).call();    

    // Get the price of the data
    let price = await balanceContract.methods.getPriceData(eventHash).call();
      
    // Represent the data in the HTML
    $('tbody').append("<tr><td>" + info[1] + "</td><td>" + convertTimestamp(time) + "</td><td>" + eventHash + "</td><td>" + price + "</td><td>");
  }

}