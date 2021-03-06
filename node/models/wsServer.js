const WebSocket = require("ws")
const express = require('express')


const TOPICS = {
	REQUEST_LATEST_BLOCK: 11,
	DELIVER_LATEST_BLOCK: 21,
	REQUEST_CHUNK: 12,
	DELIVER_CHUNK: 22,
	REQUEST_WHOLE_BLOCKCHAIN: 13,
	DELIVER_BLOCKCHAIN: 23,
	DELIVER_TX: 24,
}


module.exports = function({port, blockchain, node, pendingTransactions}) {

	var sockets = []

	connectToPeers(node.getPeers())
	node.on('AddPeers', connectToPeers)

	blockchain.on('MinedBlock', broadcastBlock)

	function startServer() {

		const server = express()
		  .listen(port, () => console.log(`Listening on ${ port }`));

		var wss = new WebSocket.Server({server})

		wss.on('connection', initConnection)
		console.log(`WS server started up at port ${port}`)
	}

	function initConnection(ws) {
		sockets.push(ws)
		initMessageHandler(ws)
		initErrorHandler(ws)
		write(ws, function() {
			broadcast({topic: TOPICS.REQUEST_LATEST_BLOCK})
		})
	}

	function connectToPeers(newPeers) {

		newPeers.forEach((peer) => {
			var ws = new WebSocket(peer)
			ws.on('open', () => initConnection(ws))
			ws.on('error', () => console.log('connection failed'))
		})
	}

	function initMessageHandler(ws) {
		ws.on('message', (data) => {
			var message = JSON.parse(data)

			console.log('* Received message: ', data)

			switch (message.topic) {
				case TOPICS.REQUEST_LATEST_BLOCK:
					write(ws, responseLatestBlock())
					break
				case TOPICS.DELIVER_LATEST_BLOCK:
					handleDeliveredBlock(message)
					break
				case TOPICS.REQUEST_WHOLE_BLOCKCHAIN:
					write(ws, responseLatestBlockchain())
					break
				case TOPICS.DELIVER_BLOCKCHAIN:
					handleDeliveredBlockchain(message)
					break
				case TOPICS.DELIVER_TX:
					handleDeliveredTx(message)
					break
				default:
					return
	        }
	    })
	}

	function initErrorHandler(ws) {
		function closeConnection(ws) {
	        console.log('connection failed to peer: ' + ws.url)
	        sockets.splice(sockets.indexOf(ws), 1)
	    }
	    ws.on('close', () => closeConnection(ws))
	    ws.on('error', () => closeConnection(ws))
	};

	function write(ws, message) {
		ws.send(JSON.stringify(message))
	}

	function broadcast(message) {
		sockets.forEach(socket => write(socket, message))
	}

	function broadcastBlock(block) {
		console.log(block)
		var message = {
			topic: TOPICS.DELIVER_LATEST_BLOCK,
			data: JSON.stringify(block)
		}
		broadcast(message)
	}

	function broadcastTx(tx) {
		var message = {
			topic: TOPICS.DELIVER_TX,
			data: JSON.stringify(tx)
		}
		broadcast(message)
	}

	function responseLatestBlock() {
		return {
			topic: TOPICS.DELIVER_LATEST_BLOCK,
			data: JSON.stringify(blockchain.getLatestBlock())
		}
	}

	function handleDeliveredBlock(message) {
		const block = JSON.parse(message.data)
		if (blockchain.addBlock(block)) {
			// It was next block and it is added to the blockchain
			return
		} else if (+block.index > blockchain.getLatestBlock().index) {
			broadcast({topic: TOPICS.REQUEST_WHOLE_BLOCKCHAIN})
		}
	}

	function responseLatestBlockchain() {
		return {
			topic: TOPICS.DELIVER_BLOCKCHAIN,
			data: JSON.stringify(blockchain.getChain())
		}
	}

	function handleDeliveredBlockchain(message) {
		blockchain.replaceChain(JSON.parse(message.data))
	}

	function handleDeliveredTx(message) {
		pendingTransactions.addTx(JSON.parse(message.data))
	}


	return {
		startServer
	}
}
