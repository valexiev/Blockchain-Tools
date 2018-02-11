const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || '5000';

var app = express();
app.use(bodyParser.json());


// * * * API * * *

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
