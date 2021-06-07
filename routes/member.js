const { joinValidator } = require('../middlewares/join_validator');
const { loginValidator } = require('../middlewares/login_validator');
const member = require("../models/member"); // Member Model
const { alert, go } = require('../lib/common');
const express = require('express');
const router = express.Router();

/** /member/join  */
router.route("/join")
		/** 회원 가입 양식 */
		.get((req, res, next) => {
			return res.render('member/form');
		})
		/** 회원 가입 처리 */
		.post(joinValidator, async (req, res, next) => {
			
			const result = await member.data(req.body).join();
			if (result) { // 회원 가입 성공 -> 로그인 페이지
				return go("/member/login", res, "parent");
			}
			
			return alert("회원가입에 실패하였습니다.", res);
		});

/** /member/login */
router.route('/login')
		/** 로그인 양식 */
		.get((req, res, next) => {
			return res.render("member/login");
		})
		/** 로그인 처리 */
		.post(loginValidator, async (req, res, next) => {
			
			const result = await member.login(req.body.memId, req.body.memPw);
			
			return res.send("");
		});

/** /member/logout */
router.get('/logout', (req, res, next) => {
	
});

module.exports = router;