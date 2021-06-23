const express = require('express');
const { alert } = require('../lib/common');
const router = express.Router();
const travel = require('../models/travel');
const { memberOnly } = require("../middlewares/member_only");
const { joinValidator } = require("../middlewares/join_validator");

/**
* 마이페이지 
*
*/

// 회원전용 페이지 체크 */
router.use(memberOnly);

router.get("/", (req, res, next) => {
	
	return res.render("mypage/index");
});


router.get("/reservation", async (req, res, next) => {
	const data = await travel.getReservations(req.query.page, 20, req.query, req.session.memNo);
	return res.render("mypage/reservation", data);
});


/** 회원정보 수정 */
router.route("/myinfo")
	/** 수정 양식 */
	.get((req, res, next) => {
		return res.render("member/form");
	})
	/** 수정 처리 */
	.post(joinValidator, (req, res, next) => {
		console.log(req.body);
		return res.send("");
	});

module.exports = router;