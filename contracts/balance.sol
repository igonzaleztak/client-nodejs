pragma solidity >=0.4.0 <= 0.6.1;


// Definition of the functions of the other contract that are going to be required
// in this contract
contract dataLedgerContract 
{
    function retrieveInfo(bytes32) public view returns (string memory, string memory) {}
}

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
    
        // mapping byte32 to index array
        mapping(bytes32 => uint) indexArraySubs;
    
        // Array with the free indexes
        uint[] arrayIndexes;
    }
    
    // Struct that holds the available Subscriptions
    struct subsStruct 
    {
        // Map that holds all the suscriptions
        mapping(bytes32 => bool) allSubs;
        
        // Map that stores all the subscribers
        mapping(bytes32 => address[]) userSubscriptions;
        
        // Map that stores the index of the previous Array
        mapping(bytes32 => mapping(address => uint)) userSubscriptionsIndex;
        
        // Array that stores free indexes
        mapping(bytes32 => uint[]) freeIndexes;
        
        // Array that holds the ids available
        bytes32[] availableTypes;
        
        // Array that holds the free indexes of the previous Array
        uint[] availableTypesIndexes;
        
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
    
    // Event to notify the sending of the tokens
    event sendTokenEvent(address indexed _addr, bytes32 indexed _hash, bytes32 indexed _txHash);
    
    // Event to awnser the token sent by the platform
    event anwserTokenEvent(bytes32 indexed _hash, bytes32 indexed _txHash);
    
    
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
        
        // Check if the subscription has expired.
        //  - True: subscription has expired. Therefore, delete the existing subscription
        //  - False: Subscription has not expired or does not exist
        if (usersSubs[msg.sender].subscriptions[subName] > now)
        {
            deleteSub(subName, msg.sender);
        }
        
        // Check whether the user is already subscribed
        require(usersSubs[msg.sender].allSubs[subName] == false, "The user is already subscribe to that type");
        
        // Create the suscription in the user struct
        usersSubs[msg.sender].allSubs[subName] = true;
        usersSubs[msg.sender].subscriptions[subName] = now + time;
        
        // Check whether there is a free index
        if (usersSubs[msg.sender].arrayIndexes.length == 0) 
        {
            usersSubs[msg.sender].arraySubs.push(subName);
            usersSubs[msg.sender].indexArraySubs[subName] = usersSubs[msg.sender].arraySubs.length;
        }
        else 
        {
            uint newIndex = usersSubs[msg.sender].arrayIndexes[usersSubs[msg.sender].arrayIndexes.length];
            usersSubs[msg.sender].arraySubs[newIndex] = subName;
            usersSubs[msg.sender].indexArraySubs[subName] = newIndex;
            
            // The index is no longer free. Therefore, it must be removed from the 
            // the array that holds the free indexes.
            delete usersSubs[msg.sender].arrayIndexes[usersSubs[msg.sender].arrayIndexes.length];
        }

        
        // Add the values of the suscription in the subsStruct
        subs.allSubs[subName] = true;
        
        // Check whether there is a free index in the array
        if (subs.freeIndexes[subName].length == 0)
        {
            subs.userSubscriptions[subName].push(msg.sender);
            subs.userSubscriptionsIndex[subName][msg.sender] = subs.userSubscriptions[subName].length;
        }
        else 
        {
            uint newIndex2 = subs.freeIndexes[subName][subs.freeIndexes[subName].length];
            subs.userSubscriptions[subName][newIndex2] = msg.sender;
            subs.userSubscriptionsIndex[subName][msg.sender] = newIndex2;
            
            // The index is no longer free. Therefore, it must be removed from the 
            // the array that holds the free indexes.
            delete subs.freeIndexes[subName][subs.freeIndexes[subName].length];
        }
        
        
        // Emit event
        emit notifyNew(msg.sender, subName, now + time);
    }
    
    
    // Endpoint used by costumer to delete subscriptions
    function deleteSub(bytes32 subName, address clientAddr) public 
    {
        // The admin can delete subscriptions if they have expired
        if (msg.sender == admin)
        {
            // Check whether the user is subscribed
            require(usersSubs[clientAddr].allSubs[subName] == true, "The user is not suscribed to the requeste type");
            
            // Check whether the susbcription has expired
            require(now > usersSubs[msg.sender].subscriptions[subName], "Subscription is still active");
            
            // Get index of Subscription
            uint _index = usersSubs[clientAddr].indexArraySubs[subName];
            
            // remove sub from userStruct
            delete usersSubs[clientAddr].allSubs[subName];
            delete usersSubs[clientAddr].arraySubs[_index];
            
            // Remove sub from subs
            delete subs.allSubs[subName];
            uint _indexSub = subs.userSubscriptionsIndex[subName][clientAddr];
            subs.freeIndexes[subName].push(_indexSub);
            delete subs.userSubscriptions[subName][_indexSub];
            delete subs.userSubscriptionsIndex[subName][clientAddr];
            
            // emit event
            emit notifyRemove(clientAddr, subName);
        }
        
        // Check whether the user is subscribed
        require(usersSubs[msg.sender].allSubs[subName] == true, "The user is not suscribed to the requeste type");
        
        // Check whether the susbcription is still active
        // require(now < usersSubs[msg.sender].subscriptions[subName], "Subscription is not active");
        
        // Get index of Subscription
        uint _index = usersSubs[msg.sender].indexArraySubs[subName];
        
        // remove sub from userStruct
        delete usersSubs[msg.sender].allSubs[subName];
        delete usersSubs[msg.sender].arraySubs[_index];
        
        // Remove sub from subs
        delete subs.allSubs[subName];
        uint _indexSub = subs.userSubscriptionsIndex[subName][msg.sender];
        subs.freeIndexes[subName].push(_indexSub);
        delete subs.userSubscriptions[subName][_indexSub];
        delete subs.userSubscriptionsIndex[subName][msg.sender];
        
        // emit event
        emit notifyRemove(msg.sender, subName);
        
        return;
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
        
        // Check whether there is a free index available
        if (subs.availableTypesIndexes.length == 0) 
        {
            subs.availableTypes.push(subName);
            subs.indexAvailableTypes[subName] = subs.availableTypes.length;
        }
        else 
        {
            uint _index = subs.availableTypesIndexes[subs.availableTypesIndexes.length];
            subs.availableTypes[_index] = subName;
            subs.indexAvailableTypes[subName] = _index;
            
            delete subs.availableTypesIndexes[subs.availableTypesIndexes.length];
        }
        

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
    
    
    // Check subscription status
    function checkSubStatus(bytes32 subName, address clientAddr) public returns (bool, uint)
    {
        // Only admin user and the customer who originated the subscription can see its status
        if (msg.sender == admin)
        {
            // If the subscription has expired delete it
            if (usersSubs[clientAddr].subscriptions[subName] > now)
            {
                deleteSub(subName, clientAddr);
            }
            return (usersSubs[clientAddr].allSubs[subName], usersSubs[clientAddr].subscriptions[subName]);
        }
        
        // If the subscription has expired delete it
        if (usersSubs[msg.sender].subscriptions[subName] > now)
        {
            deleteSub(subName, msg.sender);
        }
        return (usersSubs[msg.sender].allSubs[subName], usersSubs[msg.sender].subscriptions[subName]);
    }
    
    // Get all available types 
    function getAllTypes() public view returns (bytes32[] memory)
    {
        return subs.availableTypes;
    }
    
    
    // Checks type status
    function checkType(bytes32 typeName) public view returns (bool)
    {
        return subs.allSubs[typeName];
    }
    
    
    // Gets all the accounts subsribed to a type
    function getSubsToType(bytes32 subName) public view returns (address[] memory)
    {
        require(msg.sender == admin, "You do not have enough privileges to do this action");
        return subs.userSubscriptions[subName];
    }
    
    
    // Send token to client. 
    // Admin uses this function to send tokens to the client.
    function sendToken(bytes32 txHash, address to, bytes32 hash) public 
    {
        // Only the admin address can create tokens
        require(msg.sender == admin, "You do not have enough privileges to do this action");
        emit sendTokenEvent(to, hash, txHash);
    }
    
    
    // Anwser to token. 
    // Customers use this function to anwser back with the signed token.
    function anwserToken(bytes32 hash, bytes32 txHash) public 
    {
        emit anwserTokenEvent(hash, txHash);
    }
    
}