const db = require('../util/database');

module.exports = class User {
    constructor(emailId, googleAuthJSON) {
        this.emailId = emailId,
        this.googleAuthJSON = googleAuthJSON
    }

    static update(emailId, idToken, refreshToken, accessToken) {
        const query = `UPDATE user SET idToken="${idToken}", refreshToken="${refreshToken}", accessToken="${accessToken}" WHERE emailId="${emailId}"`;
        return db.execute(query);
    }

    // static update(emailId, accessToken, refreshToken) {
    //     const query = `UPDATE user SET accessToken="${accessToken}, refreshToken="${refreshToken}" WHERE emailId="${emailId}"`;
    //     return db.execute(query);
    // }

    static create(emailId, idToken, refreshToken, accessToken) {

        const query = `INSERT INTO user (emailId, idToken, refreshToken, accessToken) VALUES ("${emailId}", "${idToken}", "${refreshToken}", "${accessToken}")`;
        return db.execute(query);
    }

    static fetch(emailId) {
        return db.execute(`SELECT * FROM user WHERE emailId='${emailId}'`);   
    }

    static fetchToken(emailId) {
        return db.execute(`SELECT idToken FROM user WHERE emailId='${emailId}'`);   
    }

    static fetchAll() {
        return db.execute('SELECT * FROM user');
    }
}