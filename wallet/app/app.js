const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path')

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.set('views', path.join(__dirname, 'templates'))

app.route('/')
	.get((req, res) => {
		res.sendFile(__dirname + '/templates/index.html');
	});

app.post('/',urlencodedParser, (req,res) => {
   console.log(req);
   //console.log(req.params);
   res.send(JSON.stringify(req.body));
});

app.listen(3000, () => console.log('App listen on port 3000'));