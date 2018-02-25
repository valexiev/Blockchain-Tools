const HttpServer = require('./models/httpServer')
const WsServer = require('./models/wsServer')
const config = require('./config')

// const Node = require('./models/node')
const Blockchain = require('./models/blockchain')

const httpPort = process.env.PORT || config.httpPort || '5001'
const wsPort = process.env.PORT || config.wsPort || '8001'
const nodeURL = config.url + ':' + port

// Setup Node
var node = new Node(nodeURL, config.nodeName)
node.addPeers(config.initialPeers)

// Setup Blockchain
var blockchain = new Blockchain()

HttpServer({
	httpPort,
	blockchain,
	node
})

WsServer({
	wsPort,
	blockchain,
	node
}).startSerevr()
