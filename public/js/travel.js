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
		let total = 0;
		const priceAdult = Number($(".reservation").data("adult"));
		const priceChild = Number($(".reservation").data("child"));
		
		const list = $(".reservation .goods_cnt");
		$.each(list, function() {
			const name = $(this).attr("name");
			if (name.indexOf("adult") != -1) {
				total += priceAdult * Number($(this).val());
			} else if (name.indexOf("child") != -1) { 
				total += priceChild * Number($(this).val());
			}
		});
		$(".reservation .total_price .no").text(total.toLocaleString());
	},
	/**  
	* 예약 인원 정보 변경시 업데이트 
	*
	*/
	updateReservation : function() {
		const list = $(".reservation_persons .goods_cnt");
		
		let totalPrice = 0;
		$.each(list, function() {
			const li = $(this).closest("li");
			const cnt = Number($(this).val());
			let price = 0;
			if (!li.hasClass("infant")) {
				price = Number(li.data("price"));
			}
			
			let target;
			if (li.hasClass("adult")) {
				target = $(".summary .adult_cnt");
			} else if (li.hasClass("child")) {
				target = $(".summary .child_cnt");
			} else {
				target = $(".summary .infant_cnt");
			}
			
			target.text(cnt.toLocaleString());
			
			const tot = price * cnt;
			totalPrice += tot;
		});
		
		$(".summary_info .total_price .no").text(totalPrice.toLocaleString());
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
	
	/** 예약하기 버튼 클릭 처리 */
	$(".apply_reservation").click(function() {
		if ($(this).hasClass("not_login")) {
			if (!confirm('여행상품 예약은 로그인이 필요합니다. 로그인페이지로 이동하시겠습니까?')) {
				return;
			}
			
			const goodsCd = $(".reservation .goodscd").val();
			location.href='/member/login?returnUrl=/travel/' + goodsCd;
			return;
		}
		
		// 로그인 되어 있는 경우 -> 예약하기 양식으로 이동 
		frmTravelGoods.submit();
	});
	
	/** 예약하기 페이지 인원 변경 */
	$(".reservation_persons .cnt_btn").click(function() {
		const goodsCnt = $(this).closest(".goods_cnt_wrap").find(".goods_cnt");
		let cnt = Number(goodsCnt.val());
		
		if ($(this).hasClass("up")) { // 증가
			cnt++;
		} else { // 감소 
			cnt--;
		}
		
		const li = $(this).closest("li");
		let price = 0;
		if (!li.hasClass("infant")) {
			price = Number(li.data("price"));
		}
			
		const minCnt = li.hasClass("adult")?1:0;
		if (cnt < minCnt) cnt = minCnt;
			
		goodsCnt.val(cnt);
		
		const totalPrice =  price * cnt;
		const tot = li.find(".tot_price .no");
		if (tot.length > 0) {
			tot.text(totalPrice.toLocaleString());
		}
		
		travel.updateReservation();
	});
});