const db = require('../util/database');

module.exports = class User {
    constructor(emailId, googleAuthJSON) {
        this.emailId = emailId,
        this.googleAuthJSON = googleAuthJSON
    }

    static update(emailId, idToken) {
        const query = `UPDATE user SET idToken="${idToken}" WHERE emailId="${emailId}"`;
        return db.execute(query);
    }

    static update(emailId, accessToken, refreshToken) {
        const query = `UPDATE user SET accessToken="${accessToken}, refreshToken="${refreshToken}" WHERE emailId="${emailId}"`;
        return db.execute(query);
    }

    static create(emailId, idToken) {
        const query = `INSERT INTO user (emailId, idToken) VALUES ("${emailId}", "${idToken}")`;
        return db.execute(query);
    }

    static fetch(emailId) {
        return db.execute(`SELECT * FROM user WHERE emailId='${emailId}'`);   
    }
}