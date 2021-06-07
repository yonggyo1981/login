const logger = require('../lib/logger');

/**
* 회원가입, 수정 유효성 검사
* 
*/
module.exports.joinValidator = function(req, res, next) {
	console.log(req.body);
	next();
};