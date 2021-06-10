/** /admin/board */
const { adminOnly } = require('../../middlewares/member_only');
const board = require('../../models/board');
const express = require('express');
router = express.Router();

// 관리자 접속 통제 
router.use(adminOnly);

/** 공통 미들웨어 */
router.use((req, res, next) => {
	res.locals.menuCode = 'board';
	next();
});

router.route("/")
		/** 게시판 등록 양식 */
		.get((req, res, next) => {
	
			return res.render("admin/board/index");
		})
		/** 게시판 등록 처리 */
		.post(async (req, res, next) => {
			const result = await board.create(req.body.id, req.body.boardNm);
	
			return res.send("");
		})
		/** 게시판 수정 처리 */
		.patch((req, res, next) => {
			
		})
		/** 게시판 삭제 */
		.delete((req, res, nexxt) => {
			
		});

module.exports = router;