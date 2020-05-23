pragma solidity >=0.4.0 <= 0.6.2;


contract accessControlContract
{
    function getAddress(bytes32) public returns (address) {}
}


contract dataLedgerContract 
{
    struct dataStruct 
    {
        string uri;
        string description;
    }
    
    accessControlContract accessContract;
    
    event evtStoreInfo(bytes32 indexed _hash, string _uri);
    event deleteInfo(bytes32 indexed _hash);
    address admin = 0x21A018606490C031A8c02Bb6b992D8AE44ADD37f;
    
    mapping(bytes32  => dataStruct) ledger;
    
    /****************** Greeting ****************************/
    function greet() pure public returns(string memory)
    {
        return "Hello you have called the contract dataLedger.sol";
    }
    /*******************************************************/
    
    // Stores information in the blockchain
    function storeInfo(bytes32  hash, string memory uri, bytes32 id, string memory description) public
    {
        require(msg.sender == getAddress(id), "The ID that you are using is not registered");
        dataStruct memory dataToStore;
        
        dataToStore.uri = uri;
        dataToStore.description = description;
        
        ledger[hash] = dataToStore;
        
        // Emit an event once the data has been stored in the blockchain
        emit evtStoreInfo(hash, uri);
    }
    
    
    // Retrieves information from the blockchain
    function retrieveInfo(bytes32 hash) view public returns (string memory, string memory)
    {
        return (ledger[hash].uri, ledger[hash].description);
    }
    
    // Deletes a measurement from the blockchain
    function deleteMeasurement(bytes32 hash) public 
    {
        // Only the admin user can delete a measurement from the blockchain
        require(msg.sender == admin
        , "You do not have enough privileges to do this action");
        
        // Delete the measurement associated to the hash indicated by the admin
        delete ledger[hash];
        
        // Emit an event that indicates the time when the element was remove
        emit deleteInfo(hash);
    }
    
    // Access the mapping stored in the contract accessControl
    
    // Set the address where the access control contract is stored 
    function setAddress(address _address) public
    {
        require(msg.sender == admin, "You do not have privileges to do this action");
        accessContract = accessControlContract(_address);
    }
    
    // Get the value of the mapping
    function getAddress(bytes32 id) public returns (address)
    {
        return accessContract.getAddress(id);
    }
    
}

