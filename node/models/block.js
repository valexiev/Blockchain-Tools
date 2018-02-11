class Block {
	constructor(index, transactons, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, timestamp, blockHash){
		this.index = index;
		//array of transactons
		this.transactons = transactons;
		
		this.difficulty = difficulty;
		
		this.prevBlockHash = prevBlockHash;
		
		this.minedBy = minedBy;
		
		this.blockDataHash = blockDataHash;
		
		this.nonce = 0;
		
		this.timestamp = timestamp;
		
		this.blockHash = blockHash;
	}
	
	static get genesisBlock(){
		return new Block(
			0, // block index
			[], //transactions
			4, //difficulty
			'0', //previous block hash
			'Satoshi', // block miner
			'0', // blockDataHash
			123, //nonce
			1518342536, // current timestamp
			'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' // block hash
		); 
	}
}

module.exports = Block;