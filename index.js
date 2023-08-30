//! Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//! Imports
const app = express();
const PORT = process.env.PORT || 4001;
const db = require('./db');
const { userController } = require('./controllers');
// placeholder for utils
// placeholder for middleware

//! Middleware
app.use(express.json());
app.use(cors());

//! Routes
app.use('/admin', userController);
// placeholder for individual routes

//! Connections
const server = async () => {
    db();
    app.listen(PORT, () => console.log(`Running: ${PORT}`));
};
server();