const hostURL = "https://127.0.0.1:8055"


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

  // Use XMLHttpRequest to do the request
  let req = new XMLHttpRequest();
  
  // If the request is a GET
  if (payload == null)
  {
    req.open('GET', url);
    req.responseType = 'json';
    req.onload = function() 
    {
      callback(null, req.response);
    };
    req.send(null);
  }
  else 
  {
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = function()
    {
      callback(null, req.response);
    };
    req.send(JSON.stringify(payload));
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
    if(resp) console.log(resp);
    console.log("alog");
    
    // Simulate an HTTP redirect:
    window.location.replace(`${hostURL}/restricted`);
  })


}