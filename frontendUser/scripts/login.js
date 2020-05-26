const hostURL = "https://127.0.0.1:8051"


/**
 * Retrieves information from the Wallet(nodejs server)
 * @param {String} resource 
 * @param {Object} object 
 * @param {callback} callback 
 */
let creatXhrRequest =  function (resource, payload, callback)
{
  // Set the path to the resource
  let url = hostURL + resource;
  console.log(url);
  

  // Use XMLHttpRequest to do the request
  let req = new XMLHttpRequest();
  
  // If the request is a GET
  if (payload == null)
  {
    req.open('GET', url);
    req.responseType = 'json';
    req.onload = function() 
    {
      if (req.status == 200) callback(null, req.response);
    };
    req.send(null);
  }
  else 
  {
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(payload));
    req.onload = function()
    {
      if(req.status = 200) callback(null, resp);
    };
  }
};


function loginInServer()
{
  // Get the element in the account field
  let account = document.getElementById('account').value;

  // Get the element in the password field
  let password = document.getElementById('password').value;

  // Send this elements to the server to authenticate the user
  let payload = 
  {
    account: account,
    password: password
  }

  creatXhrRequest('/login', payload, function(err, resp)
  {
    console.log(resp);
    console.log("Request Sent");
        
  });



}