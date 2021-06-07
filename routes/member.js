const { joinValidator } = require('../middlewares/join_validator');
const express = require('express');
const router = express.Router();

/** /member/join  */
router.route("/join")
		/** 회원 가입 양식 */
		.get((req, res, next) => {
			return res.render('member/form');
		})
		/** 회원 가입 처리 */
		.post(joinValidator, (req, res, next) => {
			console.log(req.body);
			return res.send("");
		});

/** /member/login */
router.route('/login')
		/** 로그인 양식 */
		.get((req, res, next) => {
			
		})
		/** 로그인 처리 */
		.post((req, res, next) => {
			
		});

/** /member/logout */
router.get('/logout', (req, res, next) => {
	
});

module.exports = router;