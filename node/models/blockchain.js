const cryptoJS = require('crypto-js');
const Block = require('./block');
const Transaction = require('./transaction');
const EventEmitter = require('events');
const process = require('process');

class Blockchain extends EventEmitter {

	constructor(pendingTransactions, miningAddress, faucetAddress) {
		super()
		this.blockchain =  []
		this.difficulty = 1
		this.pendingTransactions = pendingTransactions
		this.miningReward = 50
		this.miningAddress = miningAddress

		const faucetTx = new Transaction({from: 0, to: faucetAddress, amount: 99999, signature: 0})
		this.pendingTransactions.addTx(faucetTx)
		this.minePendingTransactions(true)
	}

	/* Blockchain info methods */
	getChain() {
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

	getTx(hash) {
		this.blockchain.forEach(block => {
			block.getTransactions().forEach(tx => {
				if (tx.hash === hash) {
					return tx
				}
			})
		})

		return false
	}

	getBalanceOfAddress(address){
		let balance = 0;

		for(let i = 0; i < this.blockchain.length; i++) {
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
	addBlock(newBlock) {
		if(this.isValidNextBlock(newBlock, this.getLatestBlock())) {
			this.blockchain.push(newBlock);
			return true
		}
		return false
	}

	isValidHashDifficulty(hash,block) {
		return hash.substr(0,this.difficulty) !== Array(this.difficulty + 1).join("0");
	}

	mineBlock(block) {
		let hash = block.toHash();
		while(hash.substr(0,this.difficulty) !== Array(this.difficulty + 1).join("0")) {
			block.nonce++;
			hash = block.toHash();
		}
	}

	// createTransaction(from, to, amount) {
	// 	let transaction = new Transaction(from, to, amount);
	// 	this.pendingTransactions.push(transaction);
	// }

	minePendingTransactions(isGenesis) { // This method can be moved to miner
		var latestBlockHash
		var newIndex

		if (isGenesis) {
			latestBlockHash = 0
			newIndex = 1
		} else {
			let latestBlock = this.getLatestBlock();
			latestBlockHash = latestBlock.blockHash
			newIndex = latestBlock.index + 1;
		}

		let timestamp = Date.now();

		let block = new Block(newIndex, this.pendingTransactions.getAllPending(), this.difficulty, latestBlockHash, this.miningAddress, timestamp);

		this.mineBlock(block);

		this.blockchain.push(block);

		this.pendingTransactions.draw(); // remove all pending transactions

		// pay to miner in next block
		let coinbaseTransaction = new Transaction({from: 0, to: this.miningAddress, amount: this.miningReward, signature: 0});

		this.pendingTransactions.addTx(coinbaseTransaction); //will be added in next block

		this.emit('MinedBlock', block)
	}

	startMining() {
		// TODO: difficulty adjustment algorythm
		setInterval(() => {
			this.minePendingTransactions()
		}, 10 * 1000);
	}


	isValidNextBlock(newBlock, previousBlock) {
		let nextBlockHash = newBlock.toHash();

		if(newBlock.index !== (previousBlock.index + 1)){ //check index
			return false;
		} else if(previousBlock.blockHash !== newBlock.prevBlockHash){ //check for hash relations between blocks
			return false;
		} else if(nextBlockHash !== newBlock.blockHash){
			return false;
		} else if(!this.isValidHashDifficulty(newBlock.blockHash,newBlock)){
			return false
		} else {
			return true;
		}
	}

	isValidChain(chain) {
		for(let i = 1; i < chain.length; i++){
			if(!this.isValidNextBlock(chain[i],chain[i - 1])){ // check if some block is invalid
				return false;
			}
		}

		return true;
	}

	isChainLonger(chain) {
		return chain.length > this.blockchain.length;
	}

	replaceChain(newChain) {
		if(this.isValidChain(newChain) && isChainLonger(newChain)){
			var pendingTx = this.pendingTransactions.draw()

			var newTxStack = newChain.reduce((stack, block) => {
				block.getTransactions().forEach(tx => {
					if (!pendingTx[tx.hash]) {
						// Get only tx that are new for our stack
						// The others are alredy written in the new chain
						stack[tx.hash] = tx
					}
				})
				return stack
			}, {})

			var pendingTxArr = this.blockchain.reduce((arr, block) => {
				block.getTransactions().forEach(tx => {
					if (!newTxStack[tx.hash]) {
						// This tx is not included in the new chain, so it is pending
						arr.push(tx)
					}
				})
				return arr
			}, [])

			this.pendingTransactions.addTxArr(pendingTxArr)

			this.blockchain = newChain;
		}
	}
}

module.exports = Blockchain;
