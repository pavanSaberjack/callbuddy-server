const Event = require('../models/event')

exports.getEventsList = (req, res, next) => {
    const emailId = req.body.emailId;
    const eventId = req.body.eventId;

    if (eventId == null) {
        Event.fetchAll(emailId)
        .then(([events, fieldData]) => {
            res.status(200).json({
                result: events
            })
        })
        .catch(error => console.log(error));
    } else {
        Event.fetch(emailId, eventId)
        .then(([events, fieldData]) => {
            res.status(200).json({
                result: events
            })
        })
        .catch(error => console.log(error));
    }
};

exports.updateEvent = (req, res, next) => {
    const eventId = req.body.eventId;
    const reqMembers = req.body.reqMembers;
    const emailId = req.body.emailId;

    Event.fetch(emailId, eventId)
        .then(([events, fieldData]) => {
            if (events.length > 0) {            
                Event.update(emailId, eventId, reqMembers)
                    .then((result) => {
                        res.status(200).json({
                            result: "Success"
                        })
                    })
                    .catch(error => console.log(error))                
            } else {
                // create a new user
                Event.create(emailId, eventId, reqMembers)
                    .then((result) => {
                        res.status(200).json({
                            result: "user created"
                        })
                    })
                    .catch(error => console.log(error))
            }            
        })
        .catch(error => console.log(error));  
};
