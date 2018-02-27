const cryptoJS = require('crypto-js');
const ed = require('ed25519-supercop')
const pbkdf2 = require('pbkdf2');
const Mnemonic = require('bitcore-mnemonic');
const cryptoUtil = require('../utils/cryptoUtils'); 
const Transaction = require('../../node/models/transaction');
const request = require('request');

class Wallet {
	constructor(){
		this.id = null;
		this.password = null;
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
		
		let lastKeyPair = this.keyPairs[this.keyPairs.length - 1];
		
		//let seed = (lastKeyPair == null) ? this.secret : this.generateSecret();
		let seed = ed.createSeed()
		
		let keyPair = ed.createKeyPair(seed);
	
		let newKeyPair = {
			index : this.keyPairs.length + 1,
			secretKey : keyPair.secretKey.toString('hex'),
			publicKey : keyPair.publicKey
		}

		this.keyPairs.push(newKeyPair);
		
		return newKeyPair.publicKey;
	}

	createTransaction(to,amount) {
		this.generateAddress();
		let lastKeyPairIndex = this.keyPairs.length;
		let from = this.keyPairs[lastKeyPairIndex - 1];
	
		let new_transaction = new Transaction(from.publicKey,to,amount);
		
		let message = from.publicKey + "-" + to + "amount";
		let signature = ed.sign(message, from.publicKey, from.secretKey).toString('hex');

		let isValid = ed.verify(signature, message , from.publicKey);
		
		if(isValid){
			//send to node
			request.post(this.nodeUrl + "/transaction",{
				json : { transaction : JSON.stringify(new_transaction) }
			})
		} else {
			console.log('Transaction is not valid');
		}
	}


	
	static fromPassword(){
		let wallet = new Wallet();
		wallet.id = 1; //Todo make it random
		wallet.password = password;
		return wallet;
	}
}

let wallet = new Wallet();
wallet.password = "password";
wallet.generateAddress();
wallet.createTransaction("valio", 1);
