const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

require('dotenv').config();

const HOST = process.env.SERVER_HOST
const PORT = process.env.SERVER_PORT

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// TODO : EJS로 변경 완료 시 제거
app.use('/', express.static(path.join(__dirname, 'src')));

// 프록시 (서버 자원))
app.use('/api', createProxyMiddleware({
    target: `http://${HOST}:${8080}/api`,
    changeOrigin: true
}));

// 프록시 (서버 자원)
app.use('/public/notice', createProxyMiddleware({
    target: `http://${HOST}:${8080}/public/notice`,
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