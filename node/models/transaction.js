const cryptoJS = require('crypto-js');
const ed = require('ed25519-supercop')

class Transaction {

	constructor(from, to, amount, message, signature){
		this.from = from;
		this.to = to;
		this.amount = amount;
		this.hash = this.toHash();
		this.message = message;
		this.signature = signature;
	}

	toHash(){
		return cryptoJS.SHA256(this.from + this.to + this.amount + this.message + this.signature).toString();
	}

	verifySignature(){
		return ed.verify(this.signature, this.message , this.from);
	}
}
module.exports = Transaction;
