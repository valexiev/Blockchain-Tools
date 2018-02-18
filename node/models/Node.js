class Node {

    constructor(URL, name) {
        this.URL = URL
        this.name = name
        this.nodes = []
	}

    info() {
        return {
            nodeName: this.name,
            peersCount: this.nodes.length,
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
    }

    removePeer(peerURL) {
        const index = this.nodes.findIndex(node => node.url === peerURL)
        if ( index > -1) {
            this.nodes.splice(index, 1)
        }
    }

    getPeers() {
        return this.nodes
    }


}

module.exports = Node
