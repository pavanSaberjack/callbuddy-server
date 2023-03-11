const Event = require('../models/event')

exports.getEventsList = (req, res, next) => {

    Event.fetchAll((events) => {
        res.status(200).json({
            result: events
        });
    })    
};

exports.createEvent = (req, res, next) => {
    const eventId = req.body.eventId;
    const reqMembers = req.body.reqMembers;

    res.status(201).json({
        result: [{eventId: eventId, reqMembers: reqMembers}]
    });
};
