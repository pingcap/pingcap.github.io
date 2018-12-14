// handle wethear display website navbar
function handleWebsiteNavDisplay() {
  console.log('scrolling...')
  var scrollVal = $(this).scrollTop(),
    h = $('header').height()

  if (scrollVal > 0) {
    $('header').hide()
    $('.devcon-nav').css('top', '0')
    $('.devCon').css('padding-top', h)
  } else {
    $('header').show()
    $('.devcon-nav').css('top', h)
    $('.devCon').css('padding-top', 2 * h)
  }
}

function smoothScroll() {
  var btnName = $(this)[0].className
  var sectionName
  switch (btnName) {
    case 'schedule-btn':
      sectionName = '.agenda__container h1'
      break
    case 'instructor-btn':
      sectionName = '.instructors__container h1'
      break
    case 'contact-btn':
      sectionName = '.contact__container h1'
      break
  }
  var extraH = 0
  if ($('header').length && !$('header').is(':hidden')) {
    extraH = 2 * $('header').height()
  } else {
    extraH = $('header').height()
  }
  $('html, body').animate(
    {
      scrollTop: $(sectionName).offset().top - extraH,
    },
    1000
  )
}

function calcBtnPosition() {
  console.log('hei')
  if (window.matchMedia('(max-width: 1100px)').matches) {
    console.log('mobile')
    $('.banner button').css('left', 'auto')
    $('.banner button').css('top', 'auto')
    $('.banner .image img').attr(
      'src',
      '/images/community/devcon-banner-mobile.png'
    )
    console.log('height:', $('.banner, .image img').height())
    // var wd = $('.banner, .image img').width() * 0.127 // 74 * W / 1368
    var hd = $('.banner, .image img').height() * 0.734 // 781* H / 573
    // var btnTop = hd + 30
    // //
    // $('.banner p').css('left', wd)
    // $('.banner p').css('top', hd)
    $('.banner button').css('right', '1rem')
    $('.banner button').css('top', hd)
  } else {
    console.log('pc')
    $('.banner .image img').attr(
      'src',
      '/images/community/devcon-banner-pc.png'
    )
    var wd = $('.banner, .image img').width() * 0.127 // 74 * W / 1368
    var hd = $('.banner, .image img').height() * 0.689 // 424* H / 615
    var btnTop = hd + 30
    // //
    // $('.banner p').css('left', wd)
    // $('.banner p').css('top', hd)
    $('.banner button').css('left', wd)
    $('.banner button').css('top', btnTop)
  }

  // console.log('h: ', $('.banner, .image img').height())
  // console.log('w:', $('.banner, .image img').width())
  // var btnTop = hd + 30
  // // //
  // // $('.banner p').css('left', wd)
  // // $('.banner p').css('top', hd)
  // $('.banner button').css('left', wd)
  // $('.banner button').css('top', btnTop)
}
// calculate the positions of address and button in banner
// function calcBtnPosition() {
//   // console.log('titleImg width: ', titleImg_W, titleImg_Top)
//   console.log('imge height and width: ', $('.banner .banner__content').height())
//   console.log('width: ', $('.banner .banner__content').width())
//   if (window.matchMedia('(max-width: 599px)').matches) {
//     $('.banner .image img').attr(
//       'src',
//       '/images/community/devcon-banner-mobile.png'
//     )
//     console.log('yes matched 1100px')
//     var logo_W = $('.banner, .image').width() * 17 / 100
//     var logo_L = 0
//     var logo_top = logo_W / 2
//     // console.log(
//     //   'imge height and width: ',
//     //   $('.banner .banner__content').height()
//     // )
//     // console.log('width: ', $('.banner .banner__content').width())
//     var titleImg_W = $('.banner, .image').width() * 750 / 1366
//     var titleImg_Top = -$('.banner, .image').width() * 50 / 1500
//   } else if (
//     window.matchMedia('(max-width: 1099px)').matches &&
//     window.matchMedia('(min-width: 600px)').matches
//   ) {
//     $('.banner .image img').attr(
//       'src',
//       '/images/community/devcon-banner-mobile.png'
//     )
//     console.log('yes matched 1100px')
//     var logo_W = $('.banner, .image').width() * 15 / 100
//     var logo_L = 0
//     var logo_top = logo_W / 2
//     // console.log(
//     //   'imge height and width: ',
//     //   $('.banner .banner__content').height()
//     // )
//     // console.log('width: ', $('.banner .banner__content').width())
//     var titleImg_W = $('.banner, .image').width() * 750 / 1366
//     var titleImg_Top = -$('.banner, .image').width() * 50 / 1500
//   } else if (
//     window.matchMedia('(max-width: 1399px)').matches &&
//     window.matchMedia('(min-width: 1100px)').matches
//   ) {
//     $('.banner .image img').attr(
//       'src',
//       '/images/community/devcon-banner-pc.svg'
//     )
//     console.log('yes matched 1099 - 1400')
//     // $('.banner .image img').attr(
//     //   'src',
//     //   '/images/community/devcon-banner-pc.svg'
//     // )
//     // console.log(
//     //   'imge height and width: ',
//     //   $('.banner .banner__content').height()
//     // )
//     // console.log('width: ', $('.banner .banner__content').width())
//     var logo_W = $('.banner, .image').width() * 10 / 100
//     var logo_L = 0
//     var logo_top = logo_W / 3
//     var titleImg_W = $('.banner, .image').width() * 600 / 1366
//     var titleImg_Top = -$('.banner, .image').height() * 100 / 1400
//   } else if (
//     window.matchMedia('(max-width: 1599px)').matches &&
//     window.matchMedia('(min-width: 1400px)').matches
//   ) {
//     $('.banner .image img').attr(
//       'src',
//       '/images/community/devcon-banner-pc.svg'
//     )
//     console.log('yes matched 1400 - 1599')
//     var logo_W = $('.banner, .image').width() * 10 / 100
//     var logo_L = 0
//     var logo_top = logo_W / 3
//     var titleImg_W = $('.banner, .image').width() * 450 / 1366
//     var titleImg_W = $('.banner, .image').width() * 550 / 1366
//     var titleImg_Top = -$('.banner, .image').height() * 100 / 1400
//     window.matchMedia('(max-width: 1400px)').matches &&
//       window.matchMedia('(min-width: 1099px)').matches
//   } else if (
//     // window.matchMedia('(max-width: 2000px)').matches &&
//     window.matchMedia('(min-width: 1600px)').matches
//   ) {
//     $('.banner .image img').attr(
//       'src',
//       '/images/community/devcon-banner-pc.svg'
//     )
//     console.log('yes matched 1600 - 2000')
//     var logo_W = $('.banner, .image').width() * 10 / 100
//     var logo_L = -logo_W
//     var logo_top = logo_W / 3
//     var titleImg_W = $('.banner, .image').width() * 450 / 1366
//     // var titleImg_W = $('.banner__content,.banner-title').width() * 33 / 100
//     var titleImg_Top = -$('.banner, .image').height() * 100 / 1400
//     window.matchMedia('(max-width: 1400px)').matches &&
//       window.matchMedia('(min-width: 1099px)').matches
//   }
//   console.log('left: ', logo_L)
//   console.log(
//     'wd and top: ',
//     titleImg_W,
//     titleImg_Top,
//     logo_L,
//     logo_top,
//     logo_W
//   )
//   // var address_H = $('.banner__content .banner-title')
//   $('.banner__content .banner-tidb-logo').css('width', logo_W)
//   $('.banner__content .banner-tidb-logo').css('left', logo_L)
//   $('.banner__content .banner-tidb-logo').css('top', logo_top)
//   $('.banner__content .banner-title').css('width', titleImg_W)
//   $('.banner__content .banner-title').css('top', titleImg_Top)
//   // $('.banner__content .banner-address').css('top', titleImg_Top)
//   // var wd = $('.banner, .img').width() * 229 / 1267
//   // var hd = $('.banner, .img').height() * 354 / 570
//   // var btnTop = hd + 60
//   // //
//   // $('.banner p').css('left', wd)
//   // $('.banner p').css('top', hd)
//   // $('.banner button').css('left', wd)
//   // $('.banner button').css('top', btnTop)
// }

// handle positions of devcon navbar and website navbar when resize window
function handleWindowResize() {
  console.log('window size changed')
  if ($('header').length && !$('header').is(':hidden')) {
    var header_H = $('header').height()
    $('.devcon-nav').css('top', header_H)
    $('.devcon-nav').css('height', header_H)
    $('.devCon').css('padding-top', 2 * header_H)
  } else {
    $('.devcon-nav').css('top', 0)
  }
}

$(document).ready(function() {
  // set devcon navbar and devcon container positioon
  if ($('header').length) {
    var header_H = $('header').height()
    $('.devcon-nav').css('top', header_H)
    $('.devcon-nav').css('height', header_H)
    $('.devCon').css('padding-top', 2 * header_H)
  }

  // if (window.matchMedia('(max-width: 1100px)').matches) {
  //   console.log('m')
  //   $('.banner .image img').attr(
  //     'src',
  //     '/images/community/devcon-banner-mobile.png'
  //   )
  //   calcBtnPosition()
  // } else {
  //   console.log('p')
  //   $('.banner .image img').attr(
  //     'src',
  //     '/images/community/devcon-banner-pc.png'
  //   )
  //   console.log($('.banner .image img').height())
  calcBtnPosition()
  // }

  // handle window scrolls
  $(window).scroll(handleWebsiteNavDisplay)

  //handle window resize
  $(window).resize(handleWindowResize, calcBtnPosition)
  // $(window).resize(handleWindowResize)

  // smmooth scroll
  $('.schedule-btn').click(smoothScroll)

  $('.instructor-btn').click(smoothScroll)

  $('.contact-btn').click(smoothScroll)
})
