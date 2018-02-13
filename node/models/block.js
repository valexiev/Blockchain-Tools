const cryptoJS = require('crypto-js');

class Block {
	constructor(index, transactons, difficulty, prevBlockHash, minedBy, timestamp, blockHash, nonce){
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
	
	static get genesisBlock(){
		//TODO : add transaction with coins to faucet
		return new Block(
			0, // block index
			[], //transactions
			4, //difficulty
			'0', //previous block hash
			'Satoshi', // block miner
			1518342536, // current timestamp
			'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // block hash
			123, //nonce
		); 
	}
	
	toHash(){
		return cryptoJS.SHA256(this.index + this.prevBlockHash + this.timestamp + this.transactions + this.nonce).toString();
	}
	
	
}

module.exports = Block;