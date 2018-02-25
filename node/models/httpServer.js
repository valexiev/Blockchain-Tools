const express = require('express')
const bodyParser = require('body-parser')
// const _ = require('lodash');



module.exports = function({port, blockchain, node}) {

	// Setup Express
	var app = express()
	app.use(bodyParser.json())


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

	// app.get('/blocks/:startId/:endId', (req, res) => {
	//     // Return part of the chain
	//     const chain = blockchain.getChain()
	//     // TODO:
	//     res.json()
	// })


	// TRANSACTIONS

	app.post('/transactions', (req, res) => {
		// TODO: new transaction to be broadcasted
	})

	app.get('/transactions/:txHash', (req, res) => {
		// TODO: return tx info
	})

	app.get('/balance/:addressHash', (req, res) => {
		// TODO: return tx info
	})

	// MINING
	app.post('/mining', (req, res) => {
		// TODO: submit new mined block
	})


	// * * * LISTEN * * *

	app.listen(port, () => console.log(`Started up at port ${port}`))

	return {app}
}
