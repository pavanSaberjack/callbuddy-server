const Event = require('../models/event')

exports.getEventsList = (req, res, next) => {
    Event.fetchAll()
        .then(([events, fieldData]) => {
            res.status(200).json({
                result: events
            })
        })
        .catch(error => console.log(error));  
};

exports.createEvent = (req, res, next) => {
    const eventId = req.body.eventId;
    const reqMembers = req.body.reqMembers;




    res.status(201).json({
        result: [{eventId: eventId, reqMembers: reqMembers}]
    });
};
