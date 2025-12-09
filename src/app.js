const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./app/routes/route');
const notFound = require('../src/app/middleware/notfound');
const { globalErrorHandler } = require('../src/app/middleware/globalErrorHandler');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static for uploaded CVs
app.use('/uploads', express.static('uploads'));

// health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// main routes
app.use('/api', routes);

app.use(notFound);
app.use(globalErrorHandler);

module.exports = app;