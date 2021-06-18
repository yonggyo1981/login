/**
* 여행 관련
*
*/ 
const travel = {
	/**
	* 총 금액 업데이트 
	*
	*/
	updateTotal : function() {
		
	},
	
};

$(function() {
	/** 상품 상세 메인배너 롤링 S */
	var swiper = new Swiper(".top_box .mySwiper", {
        pagination: {
          el: ".top_box .swiper-pagination",
          type: "fraction",
        },
        navigation: {
          nextEl: ".top_box .next",
          prevEl: ".top_box .prev",
        },
    });
	/** 상품 상세 메인배너 롤링 E */
	 
	/** 수량 증가 S */
	$(".reservation .cnt_btn").click(function() {
		const _goodsCnt = $(this).closest(".goods_cnt_wrap").find(".goods_cnt");
		let goodsCnt = Number(_goodsCnt.val());
		if ($(this).hasClass("up")) { // 수량증가 
			goodsCnt++;
		} else { // 수량 감소 
			goodsCnt--;
		}
		
		if (goodsCnt < 1) goodsCnt = 1;
		_goodsCnt.val(goodsCnt);
		
		travel.updateTotal();
	});
	/** 수량 증가 E */
});