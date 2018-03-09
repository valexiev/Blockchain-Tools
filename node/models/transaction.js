const cryptoJS = require('crypto-js');
const ed = require('ed25519-supercop')

class Transaction {

	constructor({from, to, amount, signature}){
		this.from = from;
		this.to = to;
		this.amount = amount;
		this.hash = this.toHash();
		this.signature = signature;
	}

	toHash(){
		return cryptoJS.SHA256(this.from + this.to + this.amount + this.signature).toString();
	}

	verifySignature(){
		return this.from ? ed.verify(this.signature, (this.from + this.to + this.amount), this.from) : true;
	}
}
module.exports = Transaction;
