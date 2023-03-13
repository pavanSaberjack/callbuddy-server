const User = require('../models/user');

exports.getUser = (req, res, next) => {    
    const emailId = req.body.emailId;

    User.fetch(emailId)
        .then(([users, fieldData]) => {
            res.status(200).json({
                result: users
            })
        })
        .catch(error => console.log(error));  
};

exports.updateUser = (req, res, next) => {    
    const emailId = req.body.emailId;
    const googleAuthJSON = req.body.googleAuthJSON;

    User.fetch(emailId)
        .then(([users, fieldData]) => {
            if (users.length > 0) {            
                User.update(emailId, googleAuthJSON)
                    .then((result) => {
                        res.status(200).json({
                            result: "Success"
                        })
                    })
                    .catch(error => console.log(error))                
            } else {
                // create a new user
                User.create(emailId, googleAuthJSON)
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