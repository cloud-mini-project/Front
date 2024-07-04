const express = require('express');
const router = express.Router();
const setup = require('../DB');

// 계좌 생성 페이지 렌더링
router.get('/create', (req, res) => {
    // 로그인 상태 확인
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('account_create.ejs');
});

// 계좌 목록 페이지 렌더링
router.get('/list', async (req, res) => {
    // 로그인 상태 확인
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const { mysqldb } = await setup();
        const query = `SELECT * FROM account WHERE user_id = ?`;
        const values = [req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 조회 오류:', err);
                res.status(500).send('계좌 조회에 실패했습니다.');
            } else {
                res.render('account_list.ejs', { accounts: results });
            }
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).send('서버 오류');
    }
});


// 입금 및 출금 페이지 렌더링
router.get('/transaction/:id', async (req, res) => {
    // 로그인 상태 확인
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const accountId = req.params.id;
    try {
        const { mysqldb } = await setup();
        const query = `SELECT * FROM account WHERE id = ? AND user_id = ?`;
        const values = [accountId, req.session.user.id];

        mysqldb.query(query, values, (err, results) => {
            if (err) {
                console.error('계좌 조회 오류:', err);
                res.status(500).send('계좌 조회에 실패했습니다.');
            } else {
                if (results.length > 0) {
                    res.render('account_transaction.ejs', { account: results[0] });
                } else {
                    res.status(404).send('계좌를 찾을 수 없습니다.');
                }
            }
        });
    } catch (err) {
        console.error('DB 접속 실패:', err);
        res.status(500).send('서버 오류');
    }
});

module.exports = router;
