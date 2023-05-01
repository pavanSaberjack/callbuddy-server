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

function manageUpcomingEvents() {
    // Fetch all events from Google Calendar
    // For each event, check if the event is in the database and user can cancel the invite
    // If exists in database, check if required members are have accepted the invite
    // If not, send a reminder email to the required members
    // If not accepted and meeting is next 4 hours then cancel the call


    Event.fetchAll("x@x.com")
        .then(([events, fieldData]) => {
            console.log(events);
            events.map((event, i) => {
                console.log(event);
            });
        })
        .catch(error => console.log(error));
    
    console.log("This function runs every 30 secs.");
}

module.exports = class EventCronJob {

    constructor() {
        this.manager = new CronJobManager();
    }

    start() {        
        const job = new CronJob(manageUpcomingEvents, 0.1 * 60 * 1000);

        this.manager.addJob(job);
        this.manager.startAll();
    }

    stop() {
        this.manager.stopAll();
    }
}
