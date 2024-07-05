const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const HOST = '127.0.0.1';
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: '암호화키',
    resave: false,
    saveUninitialized: false,
}));

// Static files middleware
app.use(express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public', 'index.html'));
});

app.get('/accounts', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public', 'accounts.html'));
});

app.listen(PORT, () => {
    console.log(`Front-end server running at http://${HOST}:${PORT}`);
});
