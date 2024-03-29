require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/user');
const resetRoutes = require('./routes/resetPassword');
//express app
const app = express();

app.use(express.json())    //parses request body 
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes
app.use('/api/tasks',taskRoutes);
app.use('/api/user',userRoutes);
app.use('/api/reset', resetRoutes);

//test route
app.get('/', (req, res) => {
    res.send('req received')
});

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listening for requests
        app.listen(process.env.PORT, () => {
            console.log('Connected to DB and listening on port 4000')
        });
    })
    .catch(err => {
        console.log(err.message)
    });