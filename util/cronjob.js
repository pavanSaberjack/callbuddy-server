const CronJobManager = require('./cronjob-manager');
const Event = require('../models/event');
const User = require('../models/user');
const CalendarService = require('../third-party/google-calendar/gcal-service');

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


    User.fetchAll()
        .then(([users, fieldData]) => {
            users.map((user, i) => {
                // console.log(user);
                
                let idToken = user.idToken;
                if (!idToken) {
                    return;
                }

                let refreshToken = user.refreshToken;
                if (!refreshToken) {
                    return;
                }

                let accessToken = user.accessToken;
                if (!accessToken) {
                    return;
                }

                CalendarService.getMyEvents(idToken, refreshToken, accessToken)
                    .then((events) => {
                        console.log(events);
                    })
                    .catch(error => console.log(error));
            });
        })
        .catch(error => console.log(error));

    // Event.fetchAll("x@x.com")
    //     .then(([events, fieldData]) => {
    //         console.log(events);
    //         events.map((event, i) => {
    //             console.log(event);
    //         });
    //     })
    //     .catch(error => console.log(error));
    
    console.log("This function runs every 10 secs.");
}

module.exports = class EventCronJob {

    constructor() {
        this.manager = new CronJobManager();
    }

    start() {        
        const job = new CronJob(manageUpcomingEvents, 0.1 * 60 * 1000);

        this.manager.addJob(job);
        this.manager.startAll();

        console.log("Cron job started");

        setTimeout(() => {
            this.stop();
        }, 1000 * 60 * 0.2);
    }

    stop() {
        this.manager.stopAll();
    }
}
