const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

const HOST = process.env.SERVER_HOST || '127.0.0.1';
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
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
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));

// Proxy setup to redirect API calls to backend
app.use('/api', createProxyMiddleware({ target: 'http://127.0.0.1:8080', changeOrigin: true }));
app.use('/auth', createProxyMiddleware({ target: 'http://127.0.0.1:8080', changeOrigin: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public', 'index.html'));
});

app.get('/accounts', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/public', 'accounts.html'));
});

app.listen(PORT, () => {
    console.log(`Front-end server running at http://${HOST}:${PORT}`);
});
