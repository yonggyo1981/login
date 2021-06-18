const express = require('express');
const travel = require('../models/travel');
const router = express.Router();

/** 여행 상품 상세 */
router.route("/:goodsCd")
		/** 상품 상세 */
		.get(async (req, res, next) => {
			const goodsCd = req.params.goodsCd;
			const data = await travel.get(goodsCd);
			console.log(data);
			return res.render("travel/goods");
		})
		/** 상품 예약 처리 */
		.post((req, res, next) => {
			
		});

module.exports = router;