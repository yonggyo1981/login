/** /admin/board */
const { adminOnly } = require('../../middlewares/member_only');
const express = require('express');
router = express.Router();

// 관리자 접속 통제 
router.use(adminOnly);

/** 공통 미들웨어 */
router.use((req, res, next) => {
	res.locals.menuCode = 'board';
	next();
});

router.get("/", (req, res, next) => {
	
	return res.render("admin/board/index");
});

module.exports = router;