const cryptoJS = require('crypto-js');

class Transaction {

	constructor(from, to, amount){
		this.from = from;
		this.to = to;
		this.amount = amount;
		this.hash = this.toHash()
	}

	toHash(){
		return cryptoJS.SHA256(this.from + this.to + this.amount).toString();
	}
}

module.exports = Transaction;
