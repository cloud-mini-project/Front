const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

require('dotenv').config();



app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, 'src')));

const HOST = process.env.SERVER_HOST | '127.0.0.1'
const PORT = process.env.SERVER_PORT | '8081'

const PROXY_HOST = process.env.PROXY_HOST | '127.0.0.1'
const PROXY_PORT = process.env.PROXY_PORT | '8080'

app.use('/api', createProxyMiddleware({
    target: `http://${PROXY_HOST}:${PROXY_PORT}/api`,
    changeOrigin: true
}));

// 프록시 (서버 자원)
app.use('/public/notice', createProxyMiddleware({
    target: `http://${PROXY_HOST}:${PROXY_PORT}/public/notice`,
    changeOrigin: true
}));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/notice', (req, res) => {
    res.render('notice');
});

app.get('/notice/:id', (req, res) => {
    res.render('notice_detail', { id: req.params.id });
});

app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});