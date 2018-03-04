const crypto = require('crypto');
const secp256k1 = require('secp256k1');
const ripemd160 = require('ripemd160');

class Wallet {
	ripemd160(text){
		return new ripemd160().update(text).digest('hex');
	}
}

let wallet = new Wallet();