pragma solidity >=0.4.0 <= 0.6.1;


contract balanceContract 
{
    address admin = 0x21A018606490C031A8c02Bb6b992D8AE44ADD37f;

    // Struct that holds users suscriptions
    struct userStruct 
    {
        // Variable that holds all the subscriptios of the user
        mapping(bytes32 => bool) allSubs;
        
        // Variables that associate suscriptions to finaltimestamps
        mapping(bytes32 => uint) subscriptions;
        
        // Array that stores all the subscriptions
        bytes32[] arraySubs;
    
        // mappin byte32 to index array
        mapping(bytes32 => uint) indexArraySubs;
    }
    
    // Struct that holds the available Subscriptions
    struct subsStruct 
    {
        // Map that holds all the suscriptions
        mapping(bytes32 => bool) allSubs;
        
        // Array that holds the ids available
        bytes32[] availableTypes;
        
        // mappin byte32 to index array
        mapping(bytes32 => uint) indexAvailableTypes;
        
    }
    
    // Mapping that associates users to userStruct
    mapping(address => userStruct) usersSubs;
    
    // Initialize global struct
    subsStruct  subs;
    
    
    // Event to notify new Subscriptions
    event notifyNew(address indexed _addr, bytes32 indexed _subID, uint _endTime);
    
    // Event to notify the removal of Subscriptions
    event notifyRemove(address indexed _addr, bytes32 indexed _subID);
    
    // Event to notify new categories
    event notifyNewCategory(address indexed _addr, bytes32 indexed _name);
    
    // Event to notify the removal of categories
    event notifyRemoveCategory(address indexed _addr, bytes32 indexed _name);
    
    /****************** Greeting ****************************/
    function greet() pure public returns(string memory)
    {
        return "Hello you have called the contract balance-subs.sol";
    }
    /*******************************************************/
    
    
    // Endpoint used by costumers to subscribe to stuff
    function subscribeTo(bytes32 subName, uint time) public 
    {
        // Check whether the requested subscription category exists
        require(subs.allSubs[subName] == true, "The requested category does not exist");
        
        // Check whether the user is already subscribed
        require(usersSubs[msg.sender].allSubs[subName] == false, "The user is already subscribe to that type");
        
        // Create the suscription in the user struct
        usersSubs[msg.sender].allSubs[subName] = true;
        usersSubs[msg.sender].subscriptions[subName] = now + time;
        usersSubs[msg.sender].arraySubs.push(subName);
        usersSubs[msg.sender].indexArraySubs[subName] = usersSubs[msg.sender].arraySubs.length;
        
        // Add the values of the suscription in the subsStruct
        subs.allSubs[subName] = true;
        
        // Emit event
        emit notifyNew(msg.sender, subName, now + time);
    }
    
    
    // Endpoint used by costumer to delete subscriptions
    function deleteSub(bytes32 subName) public 
    {
        // Check whether the user is subscribed
        require(usersSubs[msg.sender].allSubs[subName] == true, "The user is not suscribed to the requeste type");
        
        // Check whether the susbcription is still active
        require(now < usersSubs[msg.sender].subscriptions[subName], "Subscription is not active");
        
        // Get index of Subscription
        uint _index = usersSubs[msg.sender].indexArraySubs[subName];
        
        // remove sub from userStruct
        delete usersSubs[msg.sender].allSubs[subName];
        delete usersSubs[msg.sender].arraySubs[_index];
        
        // Remove sub from subs
        delete subs.allSubs[subName];
        
        // emit event
        emit notifyRemove(msg.sender, subName);
    }
    
    
    // Endpoint for the admin user to create new topics
    function addNewType(bytes32 subName) public 
    {
        // Check if the user is the admin user
        require(msg.sender == admin, "User does not have enough privileges");
        
        // Check if the type does not exist already
        require(subs.allSubs[subName] == false, "The requested category alrady exists");
        
        // Add the category
        subs.allSubs[subName] = true;
        subs.availableTypes.push(subName);
        subs.indexAvailableTypes[subName] = subs.availableTypes.length;
        emit notifyNewCategory(msg.sender, subName);
    }
    
    
    // Endpoint for the admin user to remove existing topics
    function deleteType(bytes32 subName) public 
    {
        // Check if the user is the admin user
        require(msg.sender == admin, "User does not have enough privileges");
        
        // Check if the type exists
        require(subs.allSubs[subName] == true, "The requested category does not exist");
        
        // remove type
        delete subs.allSubs[subName];
        delete subs.availableTypes[subs.availableTypes.length];
        delete subs.indexAvailableTypes[subName];
        emit notifyRemoveCategory(msg.sender, subName);
    }
    
    
    //getAllSubscriptions shows all the suscriptions that the user is subscribed to
    function getAllSubscriptions() public view returns (bytes32[] memory)
    {
        return usersSubs[msg.sender].arraySubs;
    }
    
    
    // getAllTopics gets all the topics available in the platform
    function getAllTopics() public view returns (bytes32[] memory) 
    {
        return subs.availableTypes;
    }
    
}
