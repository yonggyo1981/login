const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');
const pagination = require('pagination');

/**
* 여행 관련
*
*/
const travel = {
	/** 처리할 데이터 */
	params : {},
	/**
	* 처리할 데이터 설정
	*
	* @param Object params 처리할 데이터 
	* @return this
	*/
	data : function(params) {
		this.params = params;
		
		return this;
	},
	/**
	* 상품 등록 
	*
	* @param String goodsCd 상품코드
	* @param String goodsNm 상품명
	*
	* @return Boolean
	*/
	create : async function(goodsCd, goodsNm) {
		try {
			const sql = "INSERT INTO travelgoods (goodsCd, goodsNm) VALUES (?, ?)";
			await sequelize.query(sql, {
				replacements : [goodsCd, goodsNm],
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	},
	/**
	* 상품목록 
	*
	* @param Integer page 페이지번호, 기본값 1 
	* @param Integer limit 1페이지당 레코드수 
	* @param qs - req.query
	* 
	* @return Object
	*/
	getGoods : async function(page, limit, qs) {
		try {
			page = page || 1;
			limit = limit || 20;
			const offset = (page - 1) * limit;
			
			let prelink = "/admin/travel";
			if (qs) {
				const addQuery = [];
				for (key in qs) {
					if (key == 'page') continue;
					
					addQuery.push(`${key}=${qs[key]}`);
				}
				
				prelink += "?" + addQuery.join("&");
			}
			
			const replacements = {};
			let sql = `SELECT COUNT(*) as cnt FROM travelgoods`;
			const rows = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.SELECT,
			});
			
			const totalResult = rows[0].cnt;
			
			
			const paginator = pagination.create('search', {prelink, current: page, rowsPerPage: limit, totalResult });
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	},
};

module.exports = travel;