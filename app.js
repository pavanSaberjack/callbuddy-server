const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const eventRouter = require('./routes/event');

const app = express();

db.execute('select * from events')
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });

app.use(bodyParser.json());

app.use(eventRouter);

app.listen(8080);