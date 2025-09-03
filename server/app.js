const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const idconvRouter = require('./routes/idconv');
const app = express();

console.log('Express server starting');
console.log(`ENVIRONMENT: ${process.env.PRODUCTION}`);
console.log(`DOCKER: ${process.env.DOCKER}`);
const MONGO_CONNECTION = `mongodb://program_pmi_app:pR0gR8m_pM1_tz@mongo:27017/?authMechanism=DEFAULT`
// const MONGO_CONNECTION = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTHDB}`

console.log(MONGO_CONNECTION)
// mongodb://program_pmi_app:pR0gR8m_pM1_tz@mongo:27017/?authMechanism=DEFAULT
mongoose.connect(MONGO_CONNECTION)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})

app.get('/test', (req, res) => {
    res.status(200).json({ alive: true, date: new Date() });
})

app.use('/auth', authRouter);
app.use('/redcap/citation/api', indexRouter);
app.use('/api/idconv', idconvRouter);

module.exports = app;
