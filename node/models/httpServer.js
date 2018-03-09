const express = require('express')
const bodyParser = require('body-parser')
const Transaction = require('./transaction');
// const _ = require('lodash');


module.exports = function({port, blockchain, node, pendingTransactions}) {

	// Setup Express
	var app = express()
	app.use(bodyParser.json())

	app.get('/', (req, res) => {
		res.send('Mining');
	})

	// * * * API * * *

	// PEERS
	app.get('/peers', (req, res) => {
		res.json(node.getPeers())
	})

	app.post('/peers', (req, res) => {
		node.addPeers([req.body.peers])
		res.send();
	});


	// NODE
	app.get('/info', (req, res) => {
		var info = node.info()
		info.blocksCount = blockchain.getChainLength()
		// TODO: add pending transactions count
		res.json(info)
	})


	// BLOCKS

	app.get('/blocks/last/', (req, res) => {
		const latestBlock = blockchain.getLatestBlock()
		res.json(latestBlock)
	})

	app.get('/blocks/:id/', (req, res) => {
	    // Return this block
	    const chain = blockchain.getChain()
	    const index = +req.params.id
	    if (chain.length >= +index + 1) {
	        res.json(chain[id])
	    } else {
			res.status(404);
			res.send('There is no block with id: ' + index);
	    }
	})

	app.get('/blocks/', (req, res) => {
	    // Return the whole chain
	    const chain = blockchain.getChain()
	    res.json(chain)
	})


	// TRANSACTIONS

	app.post('/transactions', (req, res) => {
		const tx = new Transaction(req.body.transaction)
		if (tx.verifySignature()) {
			pendingTransactions.addTx(tx)
			res.json({hash: tx.toHash()})
		} else {
			res.send({error: true});
		}
	})

	app.get('/transactions/:txHash', (req, res) => {
		res.send(blockchain.getTx(req.params.txHash));
	})

	app.get('/balance/:addressHash', (req, res) => {
		res.send(blockchain.getBalanceOfAddress(req.params.addressHash));
	})

	// MINING
	app.get('/mining', (req, res) => {
		blockchain.startMining()
		res.send(true)
	})


	// * * * LISTEN * * *

	app.listen(port, () => console.log(`Started up at port ${port}`))

	return {app}
}
