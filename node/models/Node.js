const EventEmitter = require('events');

class Node extends EventEmitter {

    constructor(URL, name) {
        this.URL = URL
        this.name = name
        this.peers = []
	}

    info() {
        return {
            nodeName: this.name,
            peersCount: this.peers.length,
            URL: this.URL
        }
    }


    // * * * PEERS MANAGEMENT * * *

    addPeers(newPeersURLs) {
        newPeersURLs.forEach(peerURL => {
            if (this.nodes.find(node => node.url === peerURL)) {
                this.nodes.push({
                    url: peerURL,
                    addedAt: Date.now()
                })
            }
        })

        this.emit('AddPeers', newPeersURLs)
    }

    getPeers() {
        return this.nodes
    }


}

module.exports = Node
