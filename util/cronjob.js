const CronJobManager = require('./cronjob-manager');
const Event = require('../models/event');

class CronJob {
    constructor(func, interval) {
        this.func = func;
        this.interval = interval;
    }

    start() {
        this.intervalId = setInterval(this.func, this.interval);
    }

    stop() {
        clearInterval(this.intervalId);
    }
}

function myFunction() {
    // Fetch all events from database
    // Check if event is in the next 30 mins
    // If yes, send notification to all users
    // If no, do nothing

    Event.fetchAll("x@x.com")
        .then(([events, fieldData]) => {
            console.log(events);
            events.map((event, i) => {
                console.log(event);
            });
        })
        .catch(error => console.log(error));


    // Event.fetchAll ((events) => {
    //     console.log(events);

    //     events.map((event, i) => {
    //         console.log(event);
    //     });
    // });
    
    console.log("This function runs every 30 secs.");
}

module.exports = class EventCronJob {

    constructor() {
        this.manager = new CronJobManager();
    }

    start() {        
        const job = new CronJob(myFunction, 0.1 * 60 * 1000);

        this.manager.addJob(job);
        this.manager.startAll();
    }

    stop() {
        this.manager.stopAll();
    }
}
