//! Dependencies
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//! Imports
const app = express();
const PORT = process.env.PORT || 4001;
const db = require('./db');
// const { validateSession } = require('./middleware')
const { 
    userController, messageController, emailController, projectController
} = require('./controllers');
// placeholder for utils

//! Middleware
app.use(express.json());
app.use(cors());

//! Routes
app.use('/admin', userController);
app.use('/message', messageController);
app.use('/email', emailController);
app.use('/projects', projectController);
// placeholder for individual routes

//! Connections
const server = async () => {
    db();
    app.listen(PORT, () => console.log(`Running: ${PORT}`));
};
server();