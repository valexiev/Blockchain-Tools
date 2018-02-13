var Blockchain = require('./models/blockchain');

var Bitcoin = new Blockchain();

var transaction1 = {
	from : "Ivan",
	to : "Valio",
	amount : 10
}

Bitcoin.createTransaction(transaction1);
Bitcoin.minePendingTransactions("Ivan");

var transaction2 = {
	from : "Valio",
	to : "Ivan",
	amount : 5
}

Bitcoin.minePendingTransactions("Valio");



console.log(Bitcoin.getBalanceOfAddress("Valio")); // 10
console.log(Bitcoin.getBalanceOfAddress("Ivan")); // 2.5

