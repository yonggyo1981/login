const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');

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
};

module.exports = travel;