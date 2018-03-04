const HttpServer = require('./models/httpServer')
const WsServer = require('./models/wsServer')
const config = require('./config')

const Node = require('./models/node')
const Blockchain = require('./models/blockchain')
const TransactionsStack = require('./models/transactionsStack')

const httpPort = process.env.PORT || config.httpPort || '5001'
const wsPort = process.env.WS_PORT || config.wsPort || '8001'
const nodeURL = config.url + ':' + httpPort

var pendingTransactions = new TransactionsStack()

// Setup Node
var node = new Node(nodeURL, config.nodeName)
node.addPeers(config.initialPeers)

// Setup Blockchain
var blockchain = new Blockchain(pendingTransactions)

HttpServer({
	port: httpPort,
	blockchain,
	node,
	pendingTransactions
})

WsServer({
	port: wsPort,
	blockchain,
	node
}).startServer()
