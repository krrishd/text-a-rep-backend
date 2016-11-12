'use strict';

let express = require('express');
let app = express();

let port = process.env.PORT || 8080;

app.configure(() => {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.post('/receive-text', require('./textHandler'));

app.listen(port);
console.log('Text A Rep server running on port ' + port);