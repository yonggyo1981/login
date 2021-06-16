const fs = require('fs').promises;
const constants = require('fs').constants;
const logger = require('../lib/logger');
const { sequelize, Sequelize : { QueryTypes } } = require('./index');

/**
* 파일 업로드 
*
*/
const fileUpload = {
	/**
	* 파일 정보 저장 
	*
	* @params Object params 업로드 된 파일 정보
	* @return Object - 추가된 idx와 현재 업로드될 폴더 경로 
	*/
	registerFileInfo : async function(params) {
		try {
			if (!params.gid) {
				throw new Error('gid 누락');
			}
			
			const sql = "INSERT INTO filedata (gid, fileName, mimeType) VALUES (:gid, :fileName, :mimeType)";
			const replacements = {
					gid : params.gid,
					fileName : params.originalname, 
					mimeType : params.mimetype,
			};
			
			const result = await sequelize.query(sql, {
				replacements,
				type : QueryTypes.INSERT,
			});
			
			const idx = result[0];
			const folder = "public/upload/" + (idx % 10);
		
			return { idx, folder };
		} catch (err) {
			logger(err.stack, 'error');
			return {};
		}
	}
};

module.exports = fileUpload;