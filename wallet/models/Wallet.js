//const cryptoJS = require('crypto-js');
const crypto = require('crypto');
const ed = require('ed25519-supercop');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const pbkdf2 = require('pbkdf2');
const Mnemonic = require('bitcore-mnemonic');
const cryptoUtil = require('../utils/cryptoUtils'); 
const Transaction = require('../../node/models/transaction');
const request = require('request');
const fs = require('fs');
const http = require('http');

class Wallet {
	constructor(password){
		this.id = null;
		this.password = password;
		this.secret = null;
		this.keyPairs = [];
		this.mnemonic = null;
		this.nodeUrl = "";
	}
	
	generateSecret(){
		// pbkdf - Password-Based Key Derivation Function
		// example return 
		// input : sha256("bitcoin")
		//output : 6842e6aec8158a7b81ab1c46dd2f9fc27a320ff870ac2fbcb8ae990e341be94f7da2d047c1457df2ef1302820267e2eab98e945691d72085d87f2978790e4077
		
		this.secret = pbkdf2.pbkdf2Sync(this.password, 'peper', 10, 32, 'sha256').toString('hex');
		return this.secret;
	}
	
	generateMnemonic(){
		let words = new Mnemonic(Mnemonic.Words.English);
		return words.toString();
	}
	
	generateSecretByMnemonic(){
		let mnemonic = this.generateMnemonic();
		let wallet = new Wallet();
		wallet.id = cryptoUtil.randomId();
		wallet.password = mnemonic;
		wallet.mnemonic = mnemonic;
		return wallet;
	}
	
	generateAddress(){
		if(this.secret == null){
			this.generateSecret();
		}
		
		//let lastKeyPair = this.keyPairs[this.keyPairs.length - 1];
		
		//let seed = (lastKeyPair == null) ? this.secret : this.generateSecret();
		let seed = ed.createSeed()
		
		let keyPair = ed.createKeyPair(seed);
	
		let newKeyPair = {
			index : this.keyPairs.length + 1,
			privateKey : keyPair.secretKey.toString('hex'),
			publicKey : keyPair.publicKey.toString('hex')
		}

		this.keyPairs.push(newKeyPair);
		
		return newKeyPair.publicKey;
	}
	
	keyPairToFile(){
		this.generateAddress(); //generate keypair
		let fileName = ed.createSeed().toString('hex');
		let stream = fs.createWriteStream("../app/keypairs/" + fileName + ".json");
		let lastKeyPair = this.keyPairs[this.keyPairs.length - 1];
		
		stream.once('open', function(fd) {
		  stream.write(JSON.stringify(lastKeyPair));
		  stream.end();
		});
		
		return '/keypairs/' + fileName + '.json';
	}

	signTransaction(to,amount,privateKey) {
		///this.generateAddress();
		let lastKeyPairIndex = this.keyPairs.length;
		let from = this.keyPairs[lastKeyPairIndex - 1];
	
		let message = from.publicKey + to + amount;
		let signature = ed.sign(message, from.publicKey, privateKey).toString('hex');

		return signature;
	}

	sendTransaction(transaction){
		// send post request to this.nodeUrl
		// http://192.168.87.96:5001/

		request.post('http://192.168.87.96:5001/transactions', { json: { transaction: transaction } },
	    	function (error, response, body) {
		        if (!error && response.statusCode == 200) {
		            console.log(body);
		        }
		    }
		);

	}

	walletFromPrivateKey(privateKey){

	}
	
	static fromPassword(){
		let wallet = new Wallet();
		wallet.id = 1; //Todo make it random
		wallet.password = password;
		return wallet;
	}
}

module.exports = Wallet;