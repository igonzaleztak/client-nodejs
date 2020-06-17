const https = require('https');
const Web3 = require('web3');
const net = require('net');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const session = require('express-session');

const blockchain = require('./libs/blockchain.js');
const client = require('./libs/client');
const access = require('./libs/accessControl');

/***************** Global variables *********************/
const gethPath = '/home/ivan/Desktop/demoPOA2/client-node/geth.ipc';
const web3 = new Web3(gethPath, net);


// TLS variables
const options = 
{
  key: fs.readFileSync('certs/private-key.pem'),
  cert: fs.readFileSync('certs/public-cert.pem')
};

// Express variables
const appHTTPS = express();


// Use CORS to allow connection with the ethereum node
appHTTPS.use(cors());

// Config express-session
let sess = {
  secret: crypto.randomBytes(32).toString('hex'), // Used to sign the session ID cookie
  cookie: {},
  resave: false,
  saveUninitialized: false
};

// Use sessions for tracking logins
appHTTPS.use(session(sess));

// Init balanceContract
const balanceContract = blockchain.initContract(web3
    , blockchain.balanceABI
    , blockchain.balanceContractAddress );
  
// Init dataContract
const dataContract = blockchain.initContract(web3
, blockchain.contractLedgerAbi
, blockchain.contractLedgerAddress);

// Init accessContract
const accessContract = blockchain.initContract(web3
  , blockchain.accessControlABI
  , blockchain.accessControlAddr)

/******************** Function /login ************************/
/**
 * Compares if the password introduced by the user is correct
 * @param {String} account 
 * @param {String} passwordHash 
 * @param {callback} callback 
 * @return Callback(error, account)
 */
let authenticateUser = async function(account, password, callback)
{
  // Get the client's private key from the wallet
  let privKey = access.getPrivateKey(web3, account, password);  
    
  // If the password is correct then the privatekey will be different than null
  if (privKey) return callback(null, account, password, privKey);
  else 
  {
    let err = new Error("The account and/or the password  you introduced are wrong");
    return callback(err, null, null, null);
  }
};


/**
 * Creates a middleware that requires a login for certain pages
 * @param {Request} req 
 * @param {Response} res 
 * @param {Next} next 
 */
function requiresLogin(req, res, next)
{
  if (req.session && req.session.userID) return next();
  else 
  {
    let err = new Error("You must be logged in to view this page.");
    err.status = 401;
    res.redirect('/')
    return next(err);
  }
}

/******************* Post Listener ***************************/
// Authentication of the user
appHTTPS.post('/login', function(req, res)
{
  let body = "";
  req.on('data', chunk => 
  {
    body += chunk;
  });
  
  req.on('end', async function()
  {
    // Retrieve the account and the password from the body
    let account = JSON.parse(body).account;
    let password = JSON.parse(body).password;
      
    // Check if the login is correct
    authenticateUser(account, password, function(err, account, password, privKey)
    {      
      if (err) return (err);
      console.log("User " + account + " has been authenticated");
      
      req.session.userID = account;
      req.session.privKey = privKey;

      res.cookie('userAccount', account);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end();
    });
  });
});

// GET /logout
appHTTPS.get('/logout', function(req, resp)
{
  if (req.session)
  {
    req.session.destroy(function(err)
    {
      if (err) return next(err);
      else 
      {
        resp.cookie('userAccount','');
        resp.redirect('/');
      }
    });
  }
});


// Retrieve the a measurement that the client has purchased
appHTTPS.post('/input', requiresLogin, function(req, resp)
{
  let body = "";
  req.on('data', chunk => 
  {
    body += chunk;
  });

  req.on('end', async function()
  {
    // Decipher the input of the transaction
    client.getInput(body
      , req.session.userID
      , req.session.privKey
      , balanceContract
      , web3
      , resp);
  });
});

// route that client uses to buydata
appHTTPS.post('/buydata', requiresLogin, function(req, resp)
{
  let body = "";
  req.on('data', chunk => 
  {
    body += chunk;
  });

  req.on('end', async function()
  {    
    client.buyData(body
      , req.session.userID
      , req.session.privKey
      , balanceContract
      , accessContract
      , web3
      , resp);
  });

});


// Root path
appHTTPS.get('/', function(req, res)
{
  res.redirect('/public');
  return;
});

// Index html without login
appHTTPS.use('/public', express.static("frontendHome"));

// Access to the restricted part
appHTTPS.use('/restricted', requiresLogin,  express.static("frontendUser"));

// Create the https server
console.log("Listening to secure messages in port: " + 8055);
https.createServer(options, appHTTPS).listen(8055);