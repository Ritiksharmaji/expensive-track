const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
require('dotenv').config();
const { readdirSync } = require('fs');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
    res.send('Hello Ritik bhai how are you !!!');
});

// Configure routes 
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

// Auth routes
app.use('/api/v1/auth', require('./routes/authRoutes'));

// Start server
const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('Listening on port:', PORT);
    });
};

server();
