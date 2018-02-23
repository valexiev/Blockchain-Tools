const cryptoJS = require('crypto-js');
const ed = require('ed25519-supercop')
const pbkdf2 = require('pbkdf2');
const Mnemonic = require('bitcore-mnemonic');
const cryptoUtil = require('../utils/cryptoUtils'); 

class Wallet {
	constructor(){
		this.id = null;
		this.password = null;
		this.secret = null;
		this.keyPairs = [];
		this.mnemonic = null;
	}
	
	generateSecret(){
		// pbkdf - Password-Based Key Derivation Function
		// example return 
		// input : sha256("bitcoin")
		//output : 6842e6aec8158a7b81ab1c46dd2f9fc27a320ff870ac2fbcb8ae990e341be94f7da2d047c1457df2ef1302820267e2eab98e945691d72085d87f2978790e4077
		
		this.secret = pbkdf2.pbkdf2Sync(this.password, 'peper', 1, 32, 'sha256');
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
		wllet.mnemonic = mnemonic;
		return wallet;
	}
	
	generateAddress(){
		if(this.secret == null){
			this.generateSecret();
		}
		
		let lastKeyPair = this.keyPairs[this.keyPairs.length - 1];
		
		let seed = (lastKeyPair == null) ? this.secret : this.generateSecret();
		
		let keyPair = ed.createKeyPair(seed);
		
		let newKeyPair = {
			index : this.keyPairs.length + 1,
			secretKey : keyPair.secretKey,
			publicKey : keyPair.publicKey
		}
		
		this.keyPairs.push(newKeyPair);
		
		return newKeyPair.publicKey;
	}
	
	
	
	static fromPassword(){
		let wallet = new Wallet();
		wallet.id = 1; //Todo make it random
		wallet.password = password;
		return wallet;
	}
}

let wallet = new Wallet();

wallet.password = '6b88c087247aa2f07ee1c5956b8e1a9f4c7f892a70e324f1bb3d161e05ca107b';

console.log(wallet.generateSecretByMnemonic());