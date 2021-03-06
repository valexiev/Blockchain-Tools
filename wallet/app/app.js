const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Wallet = require('../models/Wallet.js');
const fs = require('fs');
const request = require('request');
const http = require('http');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

let wallet = new Wallet();

//app.set('views', path.join(__dirname, 'templates'))

app.get('/', (req, res) => {
	res.render(__dirname + '/templates/index.html', { 
		privateKey : '',
		from : '',
		to : '',
		amount : '',
		signature : ''
	});
});

app.post('/',urlencodedParser, (req,res) => {
   let password = req.body.password;
  
   if(password){
	   wallet.password = password;
	   let filePath = wallet.keyPairToFile();
	   //download and delete after download
	   
	  // res.download(__dirname + "/" + filePath, filePath, function(){
	   //		fs.unlink(__dirname + "/" + filePath); //delete after download
	   //});
	
	   res.render(__dirname + '/templates/index.html', { 
	   		from : wallet.keyPairs[wallet.keyPairs.length - 1].publicKey,
	   		privateKey : wallet.keyPairs[wallet.keyPairs.length - 1].privateKey,
	   		to : '',
			amount : '',
			signature : ''
	   });
   } else {
	   res.redirect('/');
   }
});

app.post('/sign', urlencodedParser, (req, res) => {
	console.log("* sign method");
	let from = req.body.from;
	let to = req.body.addressTo;
	let privateKey = req.body.privateKey;
	let amount = req.body.amount;

	let signature = wallet.signTransaction(to, amount, privateKey);

	if(req.body.action == 'send'){
		console.log("* send transaction");
		
		console.log("from" + from);
		console.log("to" + from);
		console.log("privateKey" + from);
		console.log("amount" + from);
		
		let transaction = {
			from : from,
			to: to,
			signature : signature;
			amount : amount,
			message : from + to + amount
		}

		wallet.sendTransaction(transaction);
	}
	
	res.render(__dirname + '/templates/index.html', {
		from : from,
		privateKey : privateKey,
		to : to,
		amount : amount,
		signature : signature
	});
});

app.listen(3000, () => console.log('App listen on port 3000'));