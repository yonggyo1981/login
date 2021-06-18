$(function() {
/** 상품 상세 메인배너 롤링 */
var swiper = new Swiper(".top_box .mySwiper", {
        pagination: {
          el: ".top_box .swiper-pagination",
          type: "fraction",
        },
        navigation: {
          nextEl: ".top_box .swiper-button-next",
          prevEl: ".top_box .swiper-button-prev",
        },
      });
});