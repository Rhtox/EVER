const db = require('./db.js');

const User = {
    create: (firstName, lastName, callback) => {
        db.run(`INSERT INTO users(firstName, lastName) VALUES(?, ?)`, [firstName, lastName], function(err) {
            if (err) {
                return callback(err);
            }
            callback(null, { id: this.lastID, firstName, lastName });
        });
    },
    // Add more methods as needed
};

module.exports = User;