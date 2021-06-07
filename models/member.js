const { sequelize, Sequelize : { QueryTypes } } = require('./index');
const logger = require('../lib/logger');
const bcrypt = require('bcrypt');

/**
* 회원 Model
*
*/
const member = {
	/**
	* 처리할 데이터
	*
	*/
	params : {},
	/**
	* 처리할 데이터 설정
	*
	*/
	data : function(params) {
		this.params = params;
		return this;
	},
	/**
	* 회원 가입 처리 
	*
	*/
	join : async function() {
		try {
			const data = this.params;
			const snsType = 'none';
			const snsId = "";
			const hash = await bcrypt.hash(data.memPw, 10);
			const sql = `INSERT INTO member (memId, memPw, memNm, email, cellPhone, snsType, snsId)
									VALUES (:memId, :memPw, :memNm, :email, :cellPhone, :snsType, :snsId)`;
			
			const replacements = {
					memId : data.memId, 
					memPw : hash,
					memNm : data.memNm,
					email : data.email,
					cellPhone : data.cellPhone,
					snsType,
					snsId,
			};
			
			await sequelize.query(sql, {
				replacements, 
				type : QueryTypes.INSERT,
			});
			
			return true;
		} catch (err) {
			logger(err.stack, 'error');
			return false;
		}
	}
};

module.exports = member;