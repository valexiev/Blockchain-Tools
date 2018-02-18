const express = require('express')
const bodyParser = require('body-parser')

const config = require('./config')

const Node = require('./models/Node')

const port = process.env.PORT || config.port || '5000'
const nodeURL = config.url + ':' + port

var node = new Node(nodeURL, config.nodeName)
node.addPeers(config.initialPeers)

var app = express()
app.use(bodyParser.json())


// * * * API * * *

// NODES
app.get('/info', (req, res) => {
    var info = node.info()
    res.json(info)
});

app.get('/peers', (req, res) => {
    var info = node.getPeers()
    res.json(info)
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`)
});

module.exports = {app}
