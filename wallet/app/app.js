const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path')

let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.set('views', path.join(__dirname, 'templates'))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/templates/index.html');
});

app.post('/',(req,res) => {
	var password = req.body;
	res.send(JSON.stringify(password));
	//res.render('index.html',{
	//	data : req.body
	//});
})

app.listen(3000, () => console.log('App listen on port 3000'));