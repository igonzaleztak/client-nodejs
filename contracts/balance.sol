pragma solidity >=0.4.0 <= 0.6.1;


// Definition of the functions of the other contract that are going to be required
// in this contract
contract dataLedgerContract 
{
    function retrieveInfo(bytes32) public view returns (string memory, string memory) {}
}


contract balanceContract
{
    
    dataLedgerContract dataContract;
    
    // This variable is used to check if an account has bought
    // a measurement
    mapping(address => mapping(bytes32 => bool)) hasPaid;
    
    // Balance of the owner
    uint256 balance;
    
    // Prices of the data 
    mapping(bytes32 => uint256) catalogue;
    
    // Address of the admin/owner of information
    address admin = 0x21A018606490C031A8c02Bb6b992D8AE44ADD37f;
    
    // Definition of the event that will be emitted when a purchase is made
    event purchaseNotify(address indexed _addr, bytes32 indexed _hash, uint256 _value);
    
    // Event to store the info sent by the owner of the data to the clients 
    // in the blockchain
    event responseNotify(address indexed _addr, bytes32 indexed _hash, bytes32 _txHashExchange, bytes32 _txHashData);
    
    
    /************************* Functions **********************************************/
    
    // Function used by the admin user to set the prices of the data
    function setPriceData(bytes32 hash, uint256 price) public returns(bool)
    {
        require (msg.sender == admin, "Admin user required");
        
        // Check if the hash exists
        (string memory pubDate, string memory uri) = dataContract.retrieveInfo(hash);
        require (bytes(uri).length != 0, "Hash is not stored in the Blockchain");
        require(bytes(pubDate).length != 0, "Hash is not stored in the Blockchain");
        catalogue[hash] = price;
        
        return true;
    }
    
    
    // Function to get the price of the data
    function getPriceData(bytes32 hash) public view returns(uint256)
    {
        return catalogue[hash];
    }
    
    
    // Function to pay the data of the hash
    function payData(bytes32 hash, uint256 tokens) public
    {
        // Confirm that the amount of money sent by the client 
        // is enough to buy the data
        require(tokens >= catalogue[hash], "Not enough tokens");
        
        // Check that the user is not trying to buy something that
        // is already bought
        require(hasPaid[msg.sender][hash] != true, "Client is already buying this event");
        
        // Check if the hash exists
        (string memory pubDate, string memory uri) = dataContract.retrieveInfo(hash);
        assert (bytes(uri).length != 0);
        assert(bytes(pubDate).length != 0);
        
        // Check that the element is available to buy (price != 0)
        assert(getPriceData(hash) != 0);
        
        // Update the balance of the owner
        balance += catalogue[hash];
        
        // Update the hasPaid function to true
        hasPaid[msg.sender][hash] = true;
        
        // Emitting the event 
        emit purchaseNotify(msg.sender, hash, catalogue[hash]);
    }
    
    
    // Function that checks the value of hasPaid
    function checkHasPaid(address clientAccount, bytes32 hash) public view returns (bool)
    {
        return hasPaid[clientAccount][hash];
    }
    
    
    // Send the response to the clientAccount
    function sendToClient(address clientAccount, bytes32 hash, bytes32 txHashExchange, bytes32 txHashData) public
    {
        // The only user that can send information to the client is the admin
        assert(msg.sender == admin);
        
        // Set to false the hash
        hasPaid[clientAccount][hash] = false;
        
        // Emitting the event to assure that the response has been sent
        emit responseNotify(clientAccount, hash, txHashExchange, txHashData);
        
    }
    
    
    // Check the balance of the admin
    function checkBalance() public view returns(uint256)
    {
        assert(msg.sender == admin);
        return balance;
    }
    
    
    
    /****** Accessing the data of the other contract ******/
    
    function setAddress(address _address) public
    {
        assert(msg.sender == admin);
        dataContract = dataLedgerContract(_address);
    }
    
    
    
}