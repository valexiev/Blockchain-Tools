class TransactionsStack {

	constructor() {
		this.transactions = {}
	}

	getAllPending() {
		return this.transactions
	}

	draw() {
		var tx = this.transactions
		this.transactions = {}
		return tx
	}

	addTx(tx) {
		this.transactions[tx.hash] = tx
	}

	removeTx(tx) {
		delete this.transactions[tx.hash]
	}

	addTxArr(txArr) {
		txArr.forEach(tx => this.addTx(tx))
	}

	removeTxArr(txArr) {
		txArr.forEach(tx => this.removeTx(tx))
	}

	// TODO: delete transactions that stay in the stack too long, e.g. more than 3 days
}

module.exports = TransactionsStack;
