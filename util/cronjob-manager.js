module.exports = class CronJobManager {
    constructor() {
        this.jobs = [];
    }

    addJob(job) {
        this.jobs.push(job);
    }

    startAll() {
        this.jobs.map((job, i) => {
            job.start();
        });
    }

    stopAll() {
        this.jobs.map((job, i) => {
            job.stop();
        });
    }
}