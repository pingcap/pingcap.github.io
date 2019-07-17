$(document).ready(function() {
  var slides_per_view
  var slides_per_group
  var spaceBetween

  if (window.matchMedia('(max-width: 600px)').matches) {
    slides_per_view = 1
    slides_per_group = 1
    spaceBetween = 20
  } else if ($('.homepage-slogan-mask').length) {
    slides_per_view = 1
    slides_per_group = 1
    spaceBetween = 60
  } else {
    slides_per_view = 3
    slides_per_group = 3
    spaceBetween = 20
  }

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
    slidesPerView: slides_per_view,
    slidesPerGroup: slides_per_group,
    spaceBetween: spaceBetween,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
})
