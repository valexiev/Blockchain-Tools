const cryptoJS = require('crypto-js');

class cryptoUtil {
	static randomId(size = 64) {
        return cryptoJS.lib.WordArray.random(16).toString();
    }
}

module.exports = cryptoUtil;