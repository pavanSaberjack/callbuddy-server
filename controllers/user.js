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
    console.log(req.body);

    const emailId = req.body.emailId;
    const idToken = req.body.idToken;

    // fetch user from db
    User.fetch(emailId)
        .then(([users, fieldData]) => {            
            if (users.length > 0) {            
                // If user exists, update the user
                User.update(emailId, idToken)
                    .then((result) => {
                        res.status(200).json({
                            result: "Success"
                        })
                    })
                    .catch(error => console.log(error))                
            } else {
                // create a new user
                User.create(emailId, idToken)
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

exports.redirect = (req, res, next) => {
    
    console.log('I am hereeeeeee')
    res.redirect('com.googleusercontent.apps.177298629480-4ddd096opvtpbsf13t9gdktujkls99i9')
}