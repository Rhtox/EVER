const sqlite3 = require('sqlite3').verbose();

/**
 * @brief Creates the Group table.
 * @param db Database where the table will be created.
 */
function createGroupTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS "group" (
        id INTEGER PRIMARY KEY
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Group table created successfully.');
    });
}

/**
 * @brief Creates the User table.
 * @param db Database where the table will be created.
 */
function createUserTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        email TEXT,
        password TEXT,
        group_id INTEGER,
        FOREIGN KEY(group_id) REFERENCES "group"(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('User table created successfully.');
    });
}

/**
 * @Brief Creates junction table for User and Group tables.
 * @param db Database where the table will be created.
 */
function createUserGroupTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS user_group (
        user_id INTEGER,
        group_id INTEGER,
        PRIMARY KEY(user_id, group_id),
        FOREIGN KEY(user_id) REFERENCES user(id),
        FOREIGN KEY(group_id) REFERENCES "group"(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('UserGroup table created successfully.');
    });
}

/**
 * @brief Creates the Event table.
 * @param db Database where the table will be created.
 */
function createEventTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS event (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT,
        category_id INTEGER,
        event_date DATE,
        start_time TIME,
        end_time TIME,
        location TEXT,
        event_created_date DATE DEFAULT CURRENT_DATE,
        host_id INTEGER,
        FOREIGN KEY(category_id) REFERENCES category(id),
        FOREIGN KEY(host_id) REFERENCES user(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Event table created successfully.');
    });
}

/**
 * @brief Creates junction table for Guests in Events.
 * @param db Database where the table will be created.
 */
function createEventGuestTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS event_guest (
        event_id INTEGER,
        guest_id INTEGER,
        PRIMARY KEY(event_id, guest_id),
        FOREIGN KEY(event_id) REFERENCES event(id),
        FOREIGN KEY(guest_id) REFERENCES guest(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('EventGuest table created successfully.');
    });
}

/**
 * @brief Creates the Category table.
 * @param db Database where the table will be created.
 */
function createCategoryTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Category table created successfully.')
    });
}

/**
 * @brief Creates the Invitation table.
 * @param db Database where the table will be created.
 */
function createInvitationTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS invitation (
        id INTEGER PRIMARY KEY,
        sender_id INTEGER,
        receiver_id INTEGER,
        event_id INTEGER,
        status TEXT CHECK( status IN ('pending', 'accepted', 'declined') ) NOT NULL DEFAULT 'pending',
        FOREIGN KEY(sender_id) REFERENCES user(id),
        FOREIGN KEY(receiver_id) REFERENCES user(id),
        FOREIGN KEY(event_id) REFERENCES event(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Invitation table created successfully.');
    });
}

/**
 * @brief Creates the Notification table.
 * @param db Database where the table will be created.
 */
function createNotificationTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS notification (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        invitation_id INTEGER,
        message TEXT,
        read BOOLEAN,
        FOREIGN KEY(user_id) REFERENCES user(id),
        FOREIGN KEY(invitation_id) REFERENCES invitation(id)
    )`, (err) => {
       if (err) {
           return console.error(err.message);
       }
       console.log('Notification table created successfully.');
    });
}

/**
 * @brief Creates the RSVP table.
 * @param db Database where the table will be created.
 */
function createRSVPTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS rsvp (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        event_id INTEGER,
        invitation_id INTEGER,
        response TEXT CHECK( response IN ('A', 'N') ) NOT NULL,
        FOREIGN KEY(user_id) REFERENCES user(id),
        FOREIGN KEY(event_id) REFERENCES event(id),
        FOREIGN KEY(invitation_id) REFERENCES invitation(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('RSVP table created successfully.')
    })
}

/**
 * @brief Creates the Comment table.
 * @param db Database where the table will be created.
 */
function createCommentTable(db) {
    db.run(`CREATE TABLE IF NOT EXISTS comment (
        id INTEGER PRIMARY KEY,
        user_id INTEGER,
        event_id INTEGER,
        text TEXT,
        comment_created_date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY(user_id) REFERENCES user(id),
        FOREIGN KEY(event_id) REFERENCES event(id)
    )`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Comment table created successfully.')
    });
}


// Creates new database in db directory called data.sqlite3 and creates tables.
let db = new sqlite3.Database('./data.sqlite3', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');

    createGroupTable(db);
    createUserTable(db);
    createUserGroupTable(db);
    createEventTable(db);
    createEventGuestTable(db);
    createCategoryTable(db);
    createInvitationTable(db);
    createNotificationTable(db);
    createRSVPTable(db);
    createCommentTable(db);
});


// close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});