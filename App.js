const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const registerRouter = require('./router/register');
require('dotenv').config();

const HOST = process.env.SERVER_HOST
const PORT = process.env.SERVER_PORT

app.use(express.static('public'));

app.use(
    session({
        secret: '암호화키',
        resave: false,
        saveUninitialized: false,
    })
);

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

async function Server_run() {
    try {
        // 라우터 설정
        app.get('/', (req, res) => {
            res.render('index');
        });
        
        // 라우터 사용
        app.use('/register', registerRouter);

        // 서버 시작
        app.listen(PORT, () => {
            console.log(`Server running at http://${HOST}:${PORT}`);
        });
    } catch (error) {
        console.error('Server error:', error);
    }
}

Server_run();