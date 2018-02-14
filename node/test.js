var Blockchain = require('./models/blockchain');
var Transaction = require('./models/transaction');

var Bitcoin = new Blockchain();

Bitcoin.createTransaction("Ivan", "Valio", 10);

Bitcoin.minePendingTransactions("Ivan");

var transaction2 = {
	from : "Valio",
	to : "Ivan",
	amount : 5
}

Bitcoin.minePendingTransactions("Valio");



console.log(Bitcoin.getBalanceOfAddress("Valio")); // 10
console.log(Bitcoin.getBalanceOfAddress("Ivan")); // 2.5


