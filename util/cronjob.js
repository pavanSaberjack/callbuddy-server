const CronJobManager = require('./cronjob-manager');

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

module.exports = class EventCronJob {

    constructor() {
        this.manager = new CronJobManager();
    }

    start() {

        function myFunction() {
            console.log("This function runs every 30 secs.");
        }

        const job = new CronJob(myFunction, 0.5 * 60 * 1000);

        this.manager.addJob(job);
        this.manager.startAll();
    }

    stop() {
        this.manager.stopAll();
    }
}
