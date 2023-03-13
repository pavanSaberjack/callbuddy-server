const express = require('express');
const bodyParser = require('body-parser');
const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
const app = express();

app.use(bodyParser.json());

app.use(eventRouter);
app.use(userRouter);

app.listen(8080);