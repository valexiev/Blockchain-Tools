const EventEmitter = require('events');


class Node extends EventEmitter {

    constructor(URL, name) {
		super();
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
            if (this.peers.find(node => node.url === peerURL)) {
                this.peers.push({
                    url: peerURL,
                    addedAt: Date.now()
                })
            }
        })

        this.emit('AddPeers', newPeersURLs)
    }

    getPeers() {
        return this.peers
    }


}


module.exports = Node
