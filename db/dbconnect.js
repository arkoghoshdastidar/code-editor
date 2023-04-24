const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (error) {
        throw new Error('Unable to connect to database');
    }
}

connectToDB();