# Module for the client
This is a nodejs server which is connected to the client's blockchain node. The idea behind this component is to host a web page where the user can see and purchase the measurements.

The web page is hosted using the nodejs library ```express``` like is shown in the following lines.

````Javascript
// Index html without login
appHTTPS.use('/public', express.static("frontendHome"));

// Access to the restricted part
appHTTPS.use('/restricted', requiresLogin,  express.static("frontendUser"));
````

In the previous code, you can see that there is two diferente paths. One is used by the user before he logs in the blockchain.  In this frontend the user can only see the blocks that forms the blockchain and the measurements that ara available to be purchased. It also has a web page where the user can log in the blockchain.

After the user is logged successfully in the blockchain, he goes to the path ````/restricted````. In this one, the user can also see the blocks of the blockchain and the measurements that are available. However, the user has also a path where he can purchase new data.

To authenticate the user in the blockchain via the web site, we have programmed a middleware which checks that address and the password used by the client are correct. To do so, we use the callback:
````
let authenticateUser = async function(account, password, callback)
````
