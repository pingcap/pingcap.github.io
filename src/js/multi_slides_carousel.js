$(document).ready(function() {
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 20,
    // slidesOffsetAfter: '100',
    loop: true,
    prevButton: '.swiper-button-prev',
    nextButton: '.swiper-button-next',
  })
})
