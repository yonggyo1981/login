const { joinValidator } = require('../middlewares/join_validator');
const { loginValidator } = require('../middlewares/login_validator');
const member = require("../models/member"); // Member Model
const naverLogin = require('../models/naver_login'); // 네이버 로그인
const { alert, go } = require('../lib/common');
const express = require('express');
const router = express.Router();

/** /member/join  */
router.route("/join")
		/** 회원 가입 양식 */
		.get((req, res, next) => {			
			const data = {
				naverProfile : req.session.naverProfile || {},
			};
			
			if (data.naverProfile) {
				data.memNm = data.naverProfile.name;
				data.email = data.naverProfile.email;
			}
			console.log(data);
			return res.render('member/form', data);
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
			const data = {
				naverLoginUrl : naverLogin.getCodeUrl(),
			};
			return res.render("member/login", data);
		})
		/** 로그인 처리 */
		.post(loginValidator, async (req, res, next) => {
			
			const result = await member.login(req.body.memId, req.body.memPw, req);
			if (result) { // 로그인 성공 -> 메인 페이지
				return go("/", res, "parent");
			}
			
			return alert("로그인에 실패하셨습니다.", res);
		});

/** /member/logout */
router.get('/logout', (req, res, next) => {
	req.session.destroy();
	return res.redirect("/member/login");
});


/** /member/login_callback */
router.get("/login_callback", async (req, res, next) => {
	
	const result = await naverLogin.checkExists(req.query.code, req.query.state, req);
	if (result) { // 이미 네이버 계정이 존재 -> 로그인
		
	} else { // 존재 하지 않으면 -> 회원가입 
		return res.redirect('/member/join');
	}
});

module.exports = router;