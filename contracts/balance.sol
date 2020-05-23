pragma solidity >=0.4.0 <= 0.6.1;


// Definition of the functions of the other contract that are going to be required
// in this contract
contract dataLedgerContract 
{
    function retrieveInfo(bytes32) public view returns (string memory, string memory) {}
}

contract accessControlContract
{
    function getPubKey(address) public view returns (string memory) {}
}


contract balanceContract
{
    
    dataLedgerContract dataContract;
    accessControlContract accessContract;
    
    // Address of the admin/owner of information
    address admin = 0x21A018606490C031A8c02Bb6b992D8AE44ADD37f;
    
    // Data associated with its client
    struct clientVariables 
    {
        mapping(bytes32 => hashVariables) purchases;
    }
    
    struct hashVariables
    {
        // True if the item is being bought by the client, false otherwise
        bool purchaseInProcess;
        
        // True if the client has already bought an item, false otherwise
        bool alreadyBought;
    }
    
    
    // User Purchases
    mapping(address => clientVariables) userPurchases;
    
    
    // Balance of the owner
    uint256 balance;
    
    // Prices of the data 
    mapping(bytes32 => uint256) catalogue;
    
    // Definition of the event that will be emitted when a purchase is made
    event purchaseNotify(address indexed _addr, bytes32 indexed _hash, uint256 _value);
    
    // Event to store the info sent by the owner of the data to the clients 
    // in the blockchain
    event responseNotify(address indexed _addr, bytes32 indexed _hash, bytes32 _txHashOTP);
    
    
    /************************* Functions **********************************************/
    
    // Function used by the admin user to set the prices of the data
    function setPriceData(bytes32 hash, uint256 price) public returns(bool)
    {
        assert (msg.sender == admin);
        
        // Check if the hash exists
        (string memory pubDate, string memory uri) = dataContract.retrieveInfo(hash);
        assert (bytes(uri).length != 0);
        assert(bytes(pubDate).length != 0);
        catalogue[hash] = price;
        
        return true;
    }
    
    
    // Function to get the price of the data
    function getPriceData(bytes32 hash) public view returns(uint256)
    {
        return catalogue[hash];
    }
    
    
    // Buys a measurement
    function payData(bytes32 hash) public
    {
        // Check that the user has indicated his public key to the accessContract
        require(bytes(accessContract.getPubKey(msg.sender)).length != 0
        , "The client must indicate his public key");
        
        // Check that the user has not bought the info yet
        require(userPurchases[msg.sender].purchases[hash].alreadyBought == false
        , "The user has already bought this element");
        
        // Check that the purchase is not in procces of being paid
        require(userPurchases[msg.sender].purchases[hash].purchaseInProcess == false
        , "The proccess of this purchase is still on going");
        
        // Indicates that the process of the purchase has started
        userPurchases[msg.sender].purchases[hash].purchaseInProcess = true;
        
        // Emit event indicating that the client has bought a measurement
        emit purchaseNotify(msg.sender, hash, getPriceData(hash));
        
    }
    
    
    // Function used to indacate that the admin has sent the OTP to the client
    function sendData(address client, bytes32 hash, bytes32 txHashOTP) public  
    {
        // Only the admin user can send the data
        require(msg.sender == admin
        , "User has not enough privileges to do this option");
    
        // check that the purchase in on process 
        require(userPurchases[client].purchases[hash].purchaseInProcess == true
        , "There has not been any purchase associated to this hash and this user");
        
        // Set the variable alreadyBought to True
        userPurchases[client].purchases[hash].alreadyBought = true;
        
        // Set the variable pruchasInProcess to false
        userPurchases[client].purchases[hash].purchaseInProcess = false;
        
        // Emit event indicating that the admin has sent the OTP to the client
        emit responseNotify(client, hash, txHashOTP);
    }
    
    
    /****** Accessing the data of the other contracts ******/
    
    function setAddress(address _address) public
    {
        assert(msg.sender == admin);
        dataContract = dataLedgerContract(_address);
    }
    
    
    function setAddress2(address _address) public
    {
        assert(msg.sender == admin);
        accessContract = accessControlContract(_address);
    }
    
}