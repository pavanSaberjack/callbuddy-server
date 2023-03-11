module.exports = class Attendee {
    constructor(email, responseStatus, optional) {
        this.email = email;
        this.responseStatus = responseStatus;
        this.optional = optional;
    }

    static getAttendeesList(attendeesList) {
        if (!attendeesList || attendeesList.length === 0) {
            return []
        }

        const attendees = [];
        attendeesList.map((member, i) => {
            let email = member.email;
            let responseStatus = member.responseStatus;
            let isOptional = member.optional;
            const attendee = new Attendee(email, responseStatus, isOptional);
            attendees.push(attendee);
        });
        return attendees;
    }
}