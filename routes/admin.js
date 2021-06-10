const { adminOnly } = require('../middlewares/member_only');
const express = require('express');
const router = express.Router();

// 관리자 접속 통제 
router.use(adminOnly);

router.get("/", (req, res, next) => {
	
	return res.render("admin/main/index");
});

module.exports = router;