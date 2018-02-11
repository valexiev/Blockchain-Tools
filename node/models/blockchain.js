const cryptoJS = require('crypto-js');
const Block = require('./Block');

class Blockchain {
	
	constructor(){
		this.blockchain =  [Block.genesisBlock];
		this.difficulty = 3;
	}
	
	/* Blockchain info methods */
	getChain(){
		return this.blockchain;
	}
	
	getChainLength() {
		return this.blockchain.length;
	}
	
	getLatestBlock(){
		return this.blockchain[this.blockchain.length - 1];
	}
	
	/* end of blockchain info methods */
	
	
	calculateHash(index, prevBlockHash, timestamp, transactions, nonce){
		return cryptoJS.SHA256(index + prevBlockHash + timestamp + transactions + nonce).toString();
	}
	
	calculateHashForBlock (block) {
		const {index, prevBlockHash, timestamp, transactions, nonce} = block;
		return this.calculateHash(index, prevBlockHash, timestamp, transactions, nonce);
	}
	
	addBlock(newBlock){
		if(this.isValidNextBlock(newBlock, this.getLatestBlock())){
			this.blockchain.push(newBlock);
		}
	}
	
	isValidHashDifficulty(hash,block){
		return hash.substr(0,this.difficulty) !== Array(this.difficulty + 1).join("0");
	}
	
	isValidNextBlock(newBlock, previousBlock){
		let nextBlockHash = this.calculateHash(newBlock);
		
		
		if(newBlock.index !== (previousBlock.index + 1)){ //check index
			return false;
		} else if(previousBlock.blockHash !== newBlock.prevBlockHash){ //check for hash relations betwenn blocks
			return false;
		} else if(nextBlockHash !== newBlock.blockHash){
			return false;
		} else if(!this.isValidHashDifficulty(newBlock.blockHash,newBlock)){
			return false
		} else {
			return true;
		}
	}
	
	isValidChain(chain){
		
		for(let i = 1; i < chain.length; i++){
			if(!this.isValidNextBlock(chain[i],chain[i - 1])){ // check if some block is invalid
				return false;
			}
		}
		
		return true;
	}
	
	isChainLonger(chain){
		return chain.length > this.blockchain.length;
	}
	
	replaceChain(newChain){
		if(this.isValidChain(newChain) && isChainLonger(newChain)){
			this.blockchain = chain;
		}
	}
}


module.exports = Blockchain;