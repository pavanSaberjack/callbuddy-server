const express = require('express');
const bodyParser = require('body-parser');
const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
const EventCronJob = require('./util/cronjob');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.body);
    next();
})

app.use(eventRouter);
app.use(userRouter);

const eventJob = new EventCronJob();
eventJob.start();

app.listen(8080);