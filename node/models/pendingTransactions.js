
class PendingTransactions() {

	constructor() {
		this.pendingTransactions = {}
	}

	getAllPending() {
		return this.pendingTransactions
	}

	addTx(tx) {
		this.pendingTransactions[tx.hash] = tx
	}

	removeTx(tx) {
		delete this.pendingTransactions[tx.hash]
	}

	addTxArr(txArr) {
		txArr.forEach(tx => this.addTx(tx))
	}

	removeTxArr(txArr) {
		txArr.forEach(tx => this.removeTx(tx))
	}

	// TODO: delete transactions that stay in the stack too long, e.g. more than 3 days
}

module.exports = new PendingTransactions();
