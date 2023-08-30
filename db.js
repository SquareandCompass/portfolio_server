const mongoose = require('mongoose');
const connection = process.env.DB;
const collection = process.env.COLL;

const db = async () => {
    try {
        await mongoose.connect(`${connection}/${collection}`);
        console.log(`DB Connection: ${connection}/${collection}`);
    } catch (err) {
        throw new Error(`Unable to connect to database. Error: ${err.message}`);
    }
}

module.exports = db;