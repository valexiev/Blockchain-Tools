const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let Blockchain = require('../node/models/blockchain');

let softuni = new Blockchain();

let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
	let success;
	
	if(req.query.success){
		success = true;
	} else {
		success = false;
	}
	
	
	res.render(__dirname + '/www/index.html', { success : success });
});

app.post('/sendCoins', urlencodedParser, (req, res) => {
	//TODO: validate address and check last money request
	//from, to, amount
	softuni.createTransaction("faucet", req.body.address, 100);
	
	//redirect to home with message
	res.redirect('/?success=true');
});

app.listen(3000, () => console.log("The server working on port 3000"));