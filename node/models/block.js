const cryptoJS = require('crypto-js');

class Block {
	constructor(index, transactons, difficulty, prevBlockHash, minedBy, timestamp, blockHash, nonce) {

		this.index = index;
		//array of transactons
		this.transactions = transactons;

		this.difficulty = difficulty;

		this.prevBlockHash = prevBlockHash;

		this.minedBy = minedBy;

		this.nonce = 0;

		this.timestamp = timestamp;

		this.blockHash = this.toHash();
	}

	getTransactions() {
		return this.transactions
	}

	toHash(){
		return cryptoJS.SHA256(this.index + this.prevBlockHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}
}

module.exports = Block;
