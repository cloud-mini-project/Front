const router = require('express').Router();
const Database = require('../../Test/DB');
const sha256 = require('sha256');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/save', async (req, res) => {
    const {
        member_id,
        name,
        email,
        password,
        role,
        phone_number,
        address
    } = req.body;

    if (!member_id || !name || !email || !password || !confirm_password || !phone_number || !address) {
        if (!member_id == null) {
            
        }
        if (!name) {
            
        }
        if (!email) {
            
        }
        if (!password) {
            
        }
        if (!phone_number) {
            
        }
        if (!address) {
            
        }
    }

    try {
        const DB = await Database();
        const Encrypto = sha256(password + 'salt');
        /** MySQL Database insert list */
        const sql = `
            INSERT INTO user (
                member_id,
                password,
                name,
                email,
                role,
                phone_number,
                address
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`
        
        /** MySQL Database insert values */
        const values = [
            member_id,
            Encrypto,
            name,
            email,
            role,
            phone_number,
            address
        ];

        const [result] = await DB.execute(sql, values);
        console.log(result);

        res.render(`index`)
    } catch (error) {
        console.error('DB connect fail', error);
        res.status(500).render(`register`);
    }
});

module.exports = router;