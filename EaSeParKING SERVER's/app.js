const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./api/routes/users');

const parkingsRoutes = require('./api/routes/parkings');

const bookingsRoutes = require('./api/routes/bookings');

mongoose.connect('mongodb://' + process.env.MONGO_DB_US + ':' + process.env.MONGO_DB_PW + '@ds123012.mlab.com:23012/insyncproject', {
    useCreateIndex: true,
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use(process.env.PATH_URL_v1 + '/users', usersRoutes);

app.use(process.env.PATH_URL_v1 + '/parkings', parkingsRoutes);

app.use(process.env.PATH_URL_v1 + '/bookings', bookingsRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;