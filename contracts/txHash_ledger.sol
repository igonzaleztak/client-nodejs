pragma solidity >=0.4.0 <0.6.2;

contract txHashLedgerContract
{

    mapping (string => string) hashLedger;

    function storeInfo(string memory TxHash, string memory hash) public
    {
        hashLedger[hash] = TxHash;
    }

    function retrieveInfo(string memory hash) public view returns(string memory)
    {
        return hashLedger[hash];
    }
}
