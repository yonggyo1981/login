/** admin/travel */
const { adminOnly } = require('../../middlewares/member_only');
const express = require('express');
const router = express.Router();

// 관리자 접속 통제
router.use(adminOnly);

/** 공통 미들웨어 */
router.use((req, res, next) => {
	res.locals.menuCode = 'travelGoods';
	next();
});


router.route("/")
		.get((req, res, next) => {
			
			return res.render("admin/travel/index");
		});


module.exports = router;