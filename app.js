const express = require('express');
const bodyParser = require('body-parser');
const eventRouter = require('./routes/event');
const userRouter = require('./routes/user');
const app = express();

app.use(bodyParser.json());

app.use(eventRouter);
app.use(userRouter);

app.listen(8080);

function myFunction() {
    console.log("This function runs every 5 minutes.");
}

const intervalId = setInterval(myFunction, 0.5 * 60 * 1000); // run every 30 seconds (min * 60 seconds * 1000 milliseconds)
  
// stop the interval after 2 minutes (4 iterations)
setTimeout(() => {
    clearInterval(intervalId);
}, 2 * 60 * 1000); 