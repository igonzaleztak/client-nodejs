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

After the user is logged successfully in the blockchain, he goes to the path ````/restricted````. In this one, the user can also see the blocks of the blockchain and the measurements that are available. However, in this path the user can also see the data that he has purchased and buy new data.


To run the server just use the following order:
```Bash
nodejs main.js 
```

To access the endpoint of the client, go to `https://127.0.0.1:8055/`.

The the port in which the server is listening can be changed modifying the value of the following line:
```javascript
https.createServer(options, appHTTPS).listen(8055);
```

If this value if change, you have to change the value of the host address in the scripts of the frontend.