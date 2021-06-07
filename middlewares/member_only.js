const { alert } = require('../lib/common');

/**
* 회원전용 페이지 미들웨어
*
*/
module.exports.memberOnly = (req, res, next) => {
		if (!req.isLogin) {
			return alert('회원전용 페이지 입니다.', res, -1);
		}
			
		next();
};

/**
* 비회원 전용 페이지 미들웨어 
*
*/
module.exports.guestOnly = (req, res, next) => {
		if (req.isLogin) {
			return alert('로그인한 회원은 접속할 수 없습니다.', res, -1);
		}
		
		next();
};