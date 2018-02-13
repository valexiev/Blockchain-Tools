const cryptoJS = require('crypto-js');
const Block = require('./Block');
const Transaction = require('./Transaction');

const process = require('process');

class Blockchain {
	
	constructor(){
		this.blockchain =  [Block.genesisBlock];
		this.difficulty = 1;
		this.pendingTransactions = [];
		this.miningReward = 12.5;
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
	
	getPendingTransactions(){
		return this.pendingTransactions;
	}
	
	getBalanceOfAddress(address){
		
		let balance = 0;
		for(let i = 0; i < this.blockchain.length; i++){
			for (let k = 0; k < this.blockchain[i].transactions.length; k++){
				if(this.blockchain[i].transactions[k].to == address){
					balance += this.blockchain[i].transactions[k].amount;
				}
				
				if(this.blockchain[i].transactions[k].from == address){
					balance -= this.blockchain[i].transactions[k].amount;
				}
			}
		}

		return balance;
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
	
	mineBlock(hash,block){
		while(hash.substr(0,this.difficulty) !== Array(this.difficulty + 1).join("0")){
			block.nonce++;
			hash = this.calculateHashForBlock(block);
		}
		
		console.log("BLOCK MINED: " + hash);
	}
	
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);
	}
	
	minePendingTransactions(miningAddress){ // This method can be moved to miner
		let latestBlock = this.getLatestBlock();
		let newIndex = latestBlock.index + 1;
		let timestamp = Date.now();
		let blockHash = this.calculateHash(newIndex + JSON.stringify(this.pendingTransactions) + this.difficulty + latestBlock.hash);
		
		let block = new Block(newIndex, this.pendingTransactions, this.difficulty, latestBlock.blockHash, miningAddress, timestamp, blockHash);

		this.mineBlock(blockHash, block);
		
		this.blockchain.push(block);
		
		this.pendingTransactions = []; // remove all pending transactions
		
		//create coinbase transaction
		let coinbaseTransaction = {
			from : null,
			to : miningAddress,
			amount : this.miningReward
		}
		
		this.pendingTransactions.push(coinbaseTransaction); //will be added in next block
		
	}
	
	isValidNextBlock(newBlock, previousBlock){
		let nextBlockHash = this.calculateHashForBlock(newBlock);
		
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