const db = require('../util/database');

module.exports = class User {
    constructor(emailId, googleAuthJSON) {
        this.emailId = emailId,
        this.googleAuthJSON = googleAuthJSON
    }

    static update(emailId, googleAuthJSON) {
        const query = `UPDATE user SET googleAuthJSON="${googleAuthJSON}" WHERE emailId="${emailId}"`;
        return db.execute(query);
    }

    static create(emailId, googleAuthJSON) {
        const query = `INSERT INTO user (emailId, googleAuthJSON) VALUES ("${emailId}", "${googleAuthJSON}")`;
        return db.execute(query);
    }

    static fetch(emailId) {
        return db.execute(`SELECT * FROM user WHERE emailId='${emailId}'`);   
    }
}