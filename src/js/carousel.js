$(document).ready(function() {
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    autoplay: {
      delay: 3000,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  })
})
