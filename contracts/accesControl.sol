pragma solidity >=0.4.0 <0.6.2;

contract accessControlContract
{
    
    address admin = 0x21A018606490C031A8c02Bb6b992D8AE44ADD37f;
    mapping(bytes32 => address) whitePages;
    
    event newAddrRegistered(bytes32 indexed _id);
    event newAddrRemove(bytes32 indexed _id);
    
    mapping(address => string) clientsPubKeys;
    
    
    /****************** Greeting ****************************/
    function greet() pure public returns(string memory)
    {
        return "Hello you have called the contract accessControl.sol";
    }
    /*******************************************************/
    
    
    // Add a producer account to the list of producers
    function addAccountToRegister(bytes32 id, address account) public
    {
        assert (msg.sender == admin);
        whitePages[id] = account;
        
        emit newAddrRegistered(id);
    }
    
    
    // Remove a producer from the list of producers
    function removeAccountFromRegister(bytes32 id) public
    {
        assert(msg.sender == admin);
        delete whitePages[id];
        
        emit newAddrRemove(id);
    }
    
    
    // Gets the address of the producer
    function getAddress(bytes32 id) public view returns(address) 
    {
        return whitePages[id];
    }
    
    
    // Stores the public key of the client
    function addPubKey(string memory pubKey) public 
    {
        clientsPubKeys[msg.sender] = pubKey;
    }
    
    
    // Retrieves the value of the public Key
    function getPubKey(address addr) public view returns(string memory)
    {
        return clientsPubKeys[addr];
    }
    
    
    // Retrieves the address of the admin user
    function getAdminAddr() public view returns(address) 
    {
        return admin;
    }
    
}
