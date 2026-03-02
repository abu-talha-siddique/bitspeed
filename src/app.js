const express = require('express');
const cors = require('cors');
const path = require('path');
const { identifyRouter } = require('./routes/identify');
const { adminRouter } = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is running' });
});

app.use('/', identifyRouter);
app.use('/', adminRouter);

module.exports = app;
