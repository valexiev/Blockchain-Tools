const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const ed = require('ed25519-supercop');

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
	//from, to, amount
	let to = req.body.address;
	let from = 'd55cb1e70eaba2dd591cd3c75cd518745a5c2f99f5f3e07c281ca0229edc1445'
	let privateKey = 'e03be30f4e8620cf1edd8122cce8578db7ff3a1722e0e708ebd84f8a7a70a8492c1669e00ac2ac65e73b47961442f369678120117403f5f0145d5b9b71884c8d';
	let amount = 100;
	let message = from + to + amount;
	let signature = ed.sign(message, from, privateKey).toString('hex');

	let transaction = {
		from : from,
		to: to,
		signature : signature,
		amount : amount,
		message : from + to + amount
	}

	request.post('http://192.168.88.253:5001/transactions', { json: { transaction: transaction } },
	    function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        console.log(body);
		    } else {
		       	console.log("* error " + error);
		    }
	    }
	);
	
	//redirect to home with message
	res.redirect('/?success=true');
});

app.listen(3000, () => console.log("The server working on port 3000"));