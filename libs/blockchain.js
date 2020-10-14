const fs = require('fs')


module.exports.contractLedgerAbi = JSON.parse(fs.readFileSync('contracts/data_ledger.json'));
module.exports.contractLedgerBytecode = "6080604052600180546001600160a01b0319167321a018606490c031a8c02bb6b992d8ae44add37f17905534801561003657600080fd5b506109b5806100466000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806321f8a7211461006757806377ad95ca146100a0578063b45a85a9146100bf578063c9776a6d146101fb578063cfae3217146102f6578063e30081a014610373575b600080fd5b6100846004803603602081101561007d57600080fd5b5035610399565b604080516001600160a01b039092168252519081900360200190f35b6100bd600480360360208110156100b657600080fd5b5035610419565b005b6100bd600480360360808110156100d557600080fd5b813591908101906040810160208201356401000000008111156100f757600080fd5b82018360208201111561010957600080fd5b8035906020019184600183028401116401000000008311171561012b57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295843595909490935060408101925060200135905064010000000081111561018657600080fd5b82018360208201111561019857600080fd5b803590602001918460018302840111640100000000831117156101ba57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506104b9945050505050565b6102186004803603602081101561021157600080fd5b5035610603565b604051808060200180602001838103835285818151815260200191508051906020019080838360005b83811015610259578181015183820152602001610241565b50505050905090810190601f1680156102865780820380516001836020036101000a031916815260200191505b50838103825284518152845160209182019186019080838360005b838110156102b95781810151838201526020016102a1565b50505050905090810190601f1680156102e65780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b6102fe61073f565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610338578181015183820152602001610320565b50505050905090810190601f1680156103655780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100bd6004803603602081101561038957600080fd5b50356001600160a01b0316610760565b60008054604080516321f8a72160e01b81526004810185905290516001600160a01b03909216916321f8a7219160248082019260209290919082900301818787803b1580156103e757600080fd5b505af11580156103fb573d6000803e3d6000fd5b505050506040513d602081101561041157600080fd5b505192915050565b6001546001600160a01b031633146104625760405162461bcd60e51b81526004018080602001828103825260338152602001806108c56033913960400191505060405180910390fd5b60008181526002602052604081209061047b82826107cb565b6104896001830160006107cb565b505060405181907f072007d551e16de6c1b8938fdd0559f70033d87037e5dffa28631256df69f9fe90600090a250565b6104c282610399565b6001600160a01b0316336001600160a01b0316146105115760405162461bcd60e51b815260040180806020018281038252602b815260200180610955602b913960400191505060405180910390fd5b610519610812565b83815260208082018390526000868152600282526040902082518051849361054592849291019061082c565b50602082810151805161055e926001850192019061082c565b50905050847f06c4f2b8beb126621a4c74187a1573e7f48017b16d171df264507e2131b20f42856040518080602001828103825283818151815260200191508051906020019080838360005b838110156105c25781810151838201526020016105aa565b50505050905090810190601f1680156105ef5780820380516001836020036101000a031916815260200191505b509250505060405180910390a25050505050565b60008181526002602081815260409283902080548451600180831615610100026000190190921694909404601f81018490048402850184019095528484526060948594929391840192918491908301828280156106a15780601f10610676576101008083540402835291602001916106a1565b820191906000526020600020905b81548152906001019060200180831161068457829003601f168201915b5050845460408051602060026001851615610100026000190190941693909304601f81018490048402820184019092528181529597508694509250840190508282801561072f5780601f106107045761010080835404028352916020019161072f565b820191906000526020600020905b81548152906001019060200180831161071257829003601f168201915b5050505050905091509150915091565b60606040518060600160405280603181526020016109246031913990505b90565b6001546001600160a01b031633146107a95760405162461bcd60e51b815260040180806020018281038252602c8152602001806108f8602c913960400191505060405180910390fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b50805460018160011615610100020316600290046000825580601f106107f1575061080f565b601f01602090049060005260206000209081019061080f91906108aa565b50565b604051806040016040528060608152602001606081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061086d57805160ff191683800117855561089a565b8280016001018555821561089a579182015b8281111561089a57825182559160200191906001019061087f565b506108a69291506108aa565b5090565b61075d91905b808211156108a657600081556001016108b056fe596f7520646f206e6f74206861766520656e6f7567682070726976696c6567657320746f20646f207468697320616374696f6e596f7520646f206e6f7420686176652070726976696c6567657320746f20646f207468697320616374696f6e48656c6c6f20796f7520686176652063616c6c65642074686520636f6e747261637420646174614c65646765722e736f6c546865204944207468617420796f7520617265207573696e67206973206e6f742072656769737465726564a2646970667358221220daade6b4ec19fbba7f678e475205a0ef722977bd90e2c550791091f4f68383dc64736f6c63430006010033";
var contractLedgerAddress = "0x77fd0aFF9117621d315D37b9966696fdDc49c007"; 
module.exports.contractLedgerAddress = contractLedgerAddress;

// This function initialize the contract
module.exports.initContract = function (web3, abi, address)
{
	let myContract = new web3.eth.Contract(abi, address);

  return myContract;
}

// This function only greets the contract
module.exports.greetContract = async function(myContract)
{
  let response = myContract.methods.greet().call();
  return response;
}

// This function stores data in the specified contract and returns the
// hash of the transaction.
module.exports.storeDataLedger = async function (myContract, dataToStore, accountAddr)
{
	return new Promise(function(resolve, reject)
	{
		myContract.methods.storeInfo(dataToStore.hash
			, dataToStore.uri
			, dataToStore.id
			, dataToStore.description)
		.send({
			from: accountAddr,
			gas: 400000,
			gasPrice: 0
		}, function(err, resp) {
			if (err) reject(err);
			else resolve(resp);
		});
	});
}


/******************* Access Control Contract variables ***************************/
module.exports.accessControlABI = JSON.parse(fs.readFileSync('contracts/accessControl.json'));
module.exports.accessControlBytecode = "6080604052600080546001600160a01b0319167321a018606490c031a8c02bb6b992d8ae44add37f17905534801561003657600080fd5b50610531806100466000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80636d645b441161005b5780636d645b441461018f5780638b7e87ce14610197578063cfae3217146101b4578063fce9512a146102315761007d565b806321f8a7211461008257806351c8fa97146100bb578063670d65ea146100e9575b600080fd5b61009f6004803603602081101561009857600080fd5b5035610257565b604080516001600160a01b039092168252519081900360200190f35b6100e7600480360360408110156100d157600080fd5b50803590602001356001600160a01b0316610272565b005b6100e7600480360360208110156100ff57600080fd5b81019060208101813564010000000081111561011a57600080fd5b82018360208201111561012c57600080fd5b8035906020019184600183028401116401000000008311171561014e57600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506102d8945050505050565b61009f6102fc565b6100e7600480360360208110156101ad57600080fd5b503561030c565b6101bc610366565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101f65781810151838201526020016101de565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101bc6004803603602081101561024757600080fd5b50356001600160a01b0316610386565b6000908152600160205260409020546001600160a01b031690565b6000546001600160a01b0316331461028657fe5b60008281526001602052604080822080546001600160a01b0319166001600160a01b0385161790555183917fe2888d2900e8be92bf075b2e7c635f9813c3e18afb476d80b6dd545ad34d717391a25050565b33600090815260026020908152604090912082516102f89284019061042f565b5050565b6000546001600160a01b03165b90565b6000546001600160a01b0316331461032057fe5b60008181526001602052604080822080546001600160a01b03191690555182917f761c7f5deea18480fd4c3286fb929a518afd9c1faa2b9a6f4669ba2f86995a4a91a250565b60606040518060600160405280603481526020016104c860349139905090565b6001600160a01b038116600090815260026020818152604092839020805484516001821615610100026000190190911693909304601f810183900483028401830190945283835260609390918301828280156104235780601f106103f857610100808354040283529160200191610423565b820191906000526020600020905b81548152906001019060200180831161040657829003601f168201915b50505050509050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061047057805160ff191683800117855561049d565b8280016001018555821561049d579182015b8281111561049d578251825591602001919060010190610482565b506104a99291506104ad565b5090565b61030991905b808211156104a957600081556001016104b356fe48656c6c6f20796f7520686176652063616c6c65642074686520636f6e747261637420616363657373436f6e74726f6c2e736f6ca26469706673582212209f07f0e9ceb2d58d0e893803b32c5d8e4c883996935dda25df0f5d48f9cdd2e864736f6c63430006010033";
var accessControlAddr = "0xDCDfe07b2a024B80637FD9FA2d23391d78880D23";
module.exports.accessControlAddr = accessControlAddr;

module.exports.setAddressContractID = async function (myContract, account) 
{
		// Setting the address of controlAccess Contract
		return new Promise(function (resolve, reject)
		{
			myContract.methods.setAddress(accessControlAddr)
			.send({from: account}
			, function(err, resp)
			{
				if (err) reject(err);
				else resolve(resp);
			});
		});
}

/************************** Balance  Contract variables ***************************/
module.exports.balanceABI = JSON.parse(fs.readFileSync('contracts/balance.json'));
module.exports.balanceBytecode = "6080604052600080546001600160a01b0319167321a018606490c031a8c02bb6b992d8ae44add37f17905534801561003657600080fd5b50610f40806100466000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c806342007c861161007157806342007c86146101825780637dfde040146101ae57806399a50b42146101f5578063b074233a14610226578063c990824d14610258578063cfae32171461027b576100a9565b8063097796fd146100ae57806309dddcf01461011b578063149cde75146101235780631d9de32c146101425780632236067f1461015f575b600080fd5b6100cb600480360360208110156100c457600080fd5b50356102f8565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156101075781810151838201526020016100ef565b505050509050019250505060405180910390f35b6100cb6103ae565b6101406004803603602081101561013957600080fd5b5035610409565b005b6101406004803603602081101561015857600080fd5b503561053e565b6101406004803603604081101561017557600080fd5b50803590602001356105f5565b6101406004803603604081101561019857600080fd5b50803590602001356001600160a01b0316610626565b6101da600480360360408110156101c457600080fd5b50803590602001356001600160a01b0316610a06565b60408051921515835260208301919091528051918290030190f35b6102126004803603602081101561020b57600080fd5b5035610af1565b604080519115158252519081900360200190f35b6101406004803603606081101561023c57600080fd5b508035906001600160a01b036020820135169060400135610b06565b6101406004803603604081101561026e57600080fd5b5080359060200135610b8c565b610283610dbf565b6040805160208082528351818301528351919283929083019185019080838360005b838110156102bd5781810151838201526020016102a5565b50505050905090810190601f1680156102ea5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000546060906001600160a01b031633146103445760405162461bcd60e51b8152600401808060200182810382526033815260200180610eb46033913960400191505060405180910390fd5b600082815260036020908152604091829020805483518184028101840190945280845290918301828280156103a257602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610384575b50505050509050919050565b606060026004018054806020026020016040519081016040528092919081815260200182805480156103ff57602002820191906000526020600020905b8154815260200190600101908083116103eb575b5050505050905090565b6000546001600160a01b031633146104525760405162461bcd60e51b8152600401808060200182810382526024815260200180610ee76024913960400191505060405180910390fd5b60008181526002602052604090205460ff16156104a05760405162461bcd60e51b8152600401808060200182810382526024815260200180610e906024913960400191505060405180910390fd5b6000818152600260205260409020805460ff1916600117905560075461050457600680546001810182557ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f018290555460008281526008602052604090205561050e565b6007805460009190fe5b604051819033907fde3cd713f10754ba21eabefe59d58e9251b68f9ff9016fc20324b4e261f1d59890600090a350565b6000546001600160a01b031633146105875760405162461bcd60e51b8152600401808060200182810382526024815260200180610ee76024913960400191505060405180910390fd5b60008181526002602052604090205460ff1615156001146105d95760405162461bcd60e51b8152600401808060200182810382526025815260200180610e0e6025913960400191505060405180910390fd5b6000818152600260205260409020805460ff1916905560068054fe5b604051819083907f48585d03016d8be31bb329d396ec74ded946f7e152eaccce1445939fb7e4214790600090a35050565b6000546001600160a01b0316331415610830576001600160a01b03811660009081526001602081815260408084208685529091529091205460ff1615151461069f5760405162461bcd60e51b815260040180806020018281038252602e815260200180610de0602e913960400191505060405180910390fd5b3360009081526001602081815260408084208685529092019052902054421161070f576040805162461bcd60e51b815260206004820152601c60248201527f537562736372697074696f6e206973207374696c6c2061637469766500000000604482015290519081900360640190fd5b6001600160a01b038116600081815260016020818152604080842087855260038101835281852054818452918520805460ff191690559490935252600290910180548290811061075b57fe5b60009182526020808320909101829055848252600281526040808320805460ff19169055600482528083206001600160a01b03861684528252808320548684526005835281842080546001810182559085528385200181905586845260039092529091208054829081106107cb57fe5b6000918252602080832090910180546001600160a01b03191690558582526004815260408083206001600160a01b03871680855292528083208390555186927fab7ba7d234105b15e41e97f548ae644ed346089e33e01f8f03a862bfaebacb9191a350505b3360009081526001602081815260408084208685529091529091205460ff1615151461088d5760405162461bcd60e51b815260040180806020018281038252602e815260200180610de0602e913960400191505060405180910390fd5b336000908152600160208181526040808420868552909201905290205442106108fd576040805162461bcd60e51b815260206004820152601a60248201527f537562736372697074696f6e206973206e6f7420616374697665000000000000604482015290519081900360640190fd5b33600081815260016020818152604080842087855260038101835281852054818452918520805460ff191690559490935252600290910180548290811061094057fe5b60009182526020808320909101829055848252600281526040808320805460ff19169055600482528083203384528252808320548684526005835281842080546001810182559085528385200181905586845260039092529091208054829081106109a757fe5b6000918252602080832090910180546001600160a01b03191690558582526004815260408083203380855292528083208390555186927fab7ba7d234105b15e41e97f548ae644ed346089e33e01f8f03a862bfaebacb9191a350505050565b6000805481906001600160a01b0316331415610a8e576001600160a01b03831660009081526001602081815260408084208885529092019052902054421015610a5357610a538484610626565b50506001600160a01b03811660009081526001602081815260408084208685528083528185205493019091529091205460ff90911690610aea565b3360009081526001602081815260408084208885529092019052902054421015610abc57610abc8433610626565b50503360009081526001602081815260408084208685528083528185205493019091529091205460ff909116905b9250929050565b60009081526002602052604090205460ff1690565b6000546001600160a01b03163314610b4f5760405162461bcd60e51b8152600401808060200182810382526033815260200180610eb46033913960400191505060405180910390fd5b8281836001600160a01b03167f026171e27f75693d971e6674100c15eae4e974c1cf862fe68f053af6ea9ff50b60405160405180910390a4505050565b60008281526002602052604090205460ff161515600114610bde5760405162461bcd60e51b8152600401808060200182810382526025815260200180610e0e6025913960400191505060405180910390fd5b3360009081526001602081815260408084208685529092019052902054421015610c0c57610c0c8233610626565b33600090815260016020908152604080832085845290915290205460ff1615610c665760405162461bcd60e51b815260040180806020018281038252602a815260200180610e66602a913960400191505060405180910390fd5b336000818152600160208181526040808420878552808352818520805460ff1916851790558084018352908420428701905593909252905260040154610ce55733600090815260016020818152604080842060028101805494850181558086528386209094018790559254868552600390930190915290912055610cfb565b3360009081526001602052604081206004018054fe5b6000828152600260209081526040808320805460ff191660011790556005909152902054610d7057600082815260036020908152604080832080546001810182558185528385200180546001600160a01b03191633908117909155868552905460048452828520918552925290912055610d82565b60008281526005602052604081208054fe5b6040805142830181529051839133917fc7c18d7fd8f2b08630c0d4f0bcf252583ff50a5cf2c5d8811f8a4347191679d49181900360200190a35050565b6060604051806060016040528060338152602001610e336033913990509056fe5468652075736572206973206e6f742073757363726962656420746f207468652072657175657374652074797065546865207265717565737465642063617465676f727920646f6573206e6f7420657869737448656c6c6f20796f7520686176652063616c6c65642074686520636f6e74726163742062616c616e63652d737562732e736f6c546865207573657220697320616c72656164792073756273637269626520746f20746861742074797065546865207265717565737465642063617465676f727920616c7261647920657869737473596f7520646f206e6f74206861766520656e6f7567682070726976696c6567657320746f20646f207468697320616374696f6e5573657220646f6573206e6f74206861766520656e6f7567682070726976696c65676573a2646970667358221220197b27e8f30a552bb2ac53f1c0ccec2dd651cacf6a99d399a53aa45b0a66ae1064736f6c63430006010033";
module.exports.balanceContractAddress = "0xB7124629A5f892a4E53D7C7399A881fb73aB3314";

module.exports.setAddressBalanceContract = async function(myContract, account)
{
	// Setting the address of DataLedger Contract
	return new Promise(function(resolve, reject)
	{
		myContract.methods.setAddress(contractLedgerAddress)
		.send({
			from: account
		}
		, function(err, resp)
		{
			if (err) reject(err);
			else resolve(resp);
		});
	});
}


// This function only can be used by the owner of the data.
// It sets the price of a piece of data, which is accessible by its hash
module.exports.setPrice = function(myContract, hash, price, account)
{
	return new Promise(function(resolve, reject)
	{
		myContract.methods.setPriceData(hash, price)
		.send({
			from: account
		}
		, function (err, resp)
		{
			if (err) {reject(err);}
			else{resolve(resp);};
		});
	});
}


// Getting the price of a piece of data
module.exports.getPrice = async function (myContract, hash)
{
	let price = await myContract.methods.getPriceData(hash).call();
	return price
}


// Function that client must use to buy data
module.exports.buyData =  function(myContract, hash, tokens, account)
{
	return new Promise(function(resolve, reject)
	{
		myContract.methods.payData(hash, tokens).send({
			from: account
		}
		, function(err, resp)
		{
			if (err) reject(err);
			else resolve(resp);
		});
	});

}


// Sending transaction
module.exports.sendTransaction = function(web3, _from, _to, _data)
{

	return new Promise(function(resolve, reject)
	{
		web3.eth.sendTransaction({
			from: _from,
			to: _to,
			data: _data,
			gas: '40000000',
			gasPrice: 0
		}
		, function(error, hash)
		{
			if (error)reject(error);
			else resolve(hash);
		});
	});

}


// Emiting an event in the contract showing that the transaction has been sent
module.exports.balanceSendToClient =  function(myContract
, hash
, txHashExchange
, txHashData
, account
, clientAccount)
{
	return new Promise(function(resolve, reject)
	{
		myContract.methods.sendToClient(clientAccount, hash, txHashExchange, txHashData)
		.send({from: account}
		, function(err, resp)
		{
			if (err) reject(err);
			else resolve(resp);
		});
	});
}

	// Send transaction to contract
	module.exports.sendTransactionContract = async function(web3, transaction, privKey)
	{
		let options =  
		{
			to: 			transaction._parent._address,
			data: 		transaction.encodeABI(),
			gasPrice: '0',
			gas:	400000
		};

		let signedTransaction = await web3.eth.accounts.signTransaction(options, privKey);
		let receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
		return receipt;
	}
