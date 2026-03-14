const Datastore = require('nedb-promises');
const path = require('path');

const users = Datastore.create({
    filename: path.join(__dirname, 'users.db'),
    autoload: true,
});

// Unique index on email
users.ensureIndex({ fieldName: 'email', unique: true });

module.exports = users;
