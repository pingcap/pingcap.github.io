function processDateExpiration() {
  $('.swiper-slide').each(function() {
    const $this = $(this)
    var date = $this.find('.date')[0]
    var endTime = new Date(date.innerText).setHours(0, 0, 0, 0)
    if (
      endTime < new Date() &&
      $this.find('.meetup-register')[0].innerText !== '观看直播'
    ) {
      $this.find('a')[0].removeAttribute('href')
      $this.find('.meetup-register').text('直播结束')
      $this.find('.meetup-register').addClass('unclickable-btn')
    } else {
      $this.find('.meetup-register').text('观看直播')
    }
  })
}

$(document).ready(function() {
  var mySwiper = new Swiper('.swiper-container', {
    width: 400,
    direction: 'horizontal',
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    slidesPerView: 'auto',
    loop: true,
  })

  if ($('.swiper-container .swiper-slide').length <= 3) {
    mySwiper.destroy()
    $('.swiper-pagination').hide()
  }

  if (window.location.pathname == '/community-cn/paper-reading/') {
    processDateExpiration()
  }
})
