const balanceABI = '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"_txHash","type":"bytes32"}],"name":"anwserTokenEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"_subID","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"_endTime","type":"uint256"}],"name":"notifyNew","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"_name","type":"bytes32"}],"name":"notifyNewCategory","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"_subID","type":"bytes32"}],"name":"notifyRemove","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"_name","type":"bytes32"}],"name":"notifyRemoveCategory","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_addr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"_hash","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"_txHash","type":"bytes32"}],"name":"sendTokenEvent","type":"event"},{"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"}],"name":"addNewType","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes32","name":"txHash","type":"bytes32"}],"name":"anwserToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"},{"internalType":"address","name":"clientAddr","type":"address"}],"name":"checkSubStatus","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"typeName","type":"bytes32"}],"name":"checkType","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"},{"internalType":"address","name":"clientAddr","type":"address"}],"name":"deleteSub","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"}],"name":"deleteType","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllTypes","outputs":[{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"}],"name":"getSubsToType","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greet","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"bytes32","name":"txHash","type":"bytes32"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"sendToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"subName","type":"bytes32"},{"internalType":"uint256","name":"time","type":"uint256"}],"name":"subscribeTo","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
const balanceAddr = "0xB7124629A5f892a4E53D7C7399A881fb73aB3314";