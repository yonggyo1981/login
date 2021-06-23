/**
* 비밀번호 찾기 유효성 검사 
*
*/
module.exports.findPwValidator = (req, res, next) => {
	const required = {
		memId : "아이디를 입력하세요",
		memNm : "회원이름을 입력하세요",
	};
	next();
};