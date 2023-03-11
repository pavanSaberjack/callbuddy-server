const { google } = require('googleapis');
const googleServices = require('../third-party/google-calendar/google-calendar-services');

const Attendee = require('./attendee');
const events = [];

module.exports = class Event {
    constructor(title, description, eventId, start, attendees) {
        this.title = title;
        this.description = description
        this.eventId = eventId;
        this.start = start;
        this.attendees = attendees;
        // this.requiredMemberEmailIds = requiredMemberEmailIds
    }

    save() {
        this.attendeesStr = this.getAttendeesListAsString();
        events.push(this);
    }

    getAttendeesListAsString() {
        var memberListStr = "";
        this.attendees.map((member, i) => {
            memberListStr = memberListStr.concat(", ".concat(member.email));
        });
        return memberListStr;
    }

    static fetchAll(cb) {
        // TODO: Temp fix to avoid calling APIs
        // if (events.length > 0) {
        //     return cb(events);
        // }

        googleServices.getMyEvents().then((calendarEvents) => {
            calendarEvents.map((calendarEvent, i) => {
                let title = calendarEvent.summary;
                let eventId = calendarEvent.id;
                let description = calendarEvent.description;
                let start = calendarEvent.start.dateTime || calendarEvent.start.date;
                let attendeesList = Attendee.getAttendeesList(calendarEvent.attendees);
                const event = new Event(title, description, eventId, start, attendeesList);
                event.attendeesStr = event.getAttendeesListAsString();
                // console.log(event.getAttendeesListAsString());
                events.push(event);
            });
            cb(events);
        });   
    }

    static delete(eventId, cb) {
        if (!eventId) {
            return cb();
        }

        googleServices.deleteEvent(eventId).then(() => {
            Event.fetchAll(cb);             
        });
    }
}