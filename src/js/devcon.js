// handle wethear display website navbar
function handleWebsiteNavDisplay() {
  // console.log('scrolling...')
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
    case 'signup-btn':
      sectionName = '.signup__container'
      break
  }

  console.log('$(sectionName).offset().top', $(sectionName).offset().top)
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
  // console.log('hei')
  if (window.matchMedia('(max-width: 1100px)').matches) {
    // console.log('mobile')
    // $('.banner button').css('left', 'auto')
    // $('.banner button').css('top', 'auto')
    $('.banner .image img').attr(
      'src',
      '/images/community/devcon-banner-mobile.png'
    )
    // console.log('height:', $('.banner, .image img').height())
    // var hd = $('.banner, .image img').height() * 0.734 // 781* H / 573
    // $('.banner button').css('right', '1rem')
    // $('.banner button').css('top', hd)
  } else {
    // console.log('pc')
    $('.banner .image img').attr(
      'src',
      '/images/community/devcon-banner-pc.png'
    )
    // var wd = $('.banner, .image img').width() * 0.127 // 74 * W / 1368
    // var hd = $('.banner, .image img').height() * 0.689 // 424* H / 615
    // var btnTop = hd + 30

    // $('.banner button').css('left', wd)
    // $('.banner button').css('top', btnTop)
  }
}

// handle positions of devcon navbar and website navbar when resize window
function handleWindowResize() {
  // console.log('window size changed')
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

  calcBtnPosition()

  // handle window scrolls
  $(window).scroll(handleWebsiteNavDisplay)

  //handle window resize
  $(window).resize(handleWindowResize, calcBtnPosition)
  // $(window).resize(handleWindowResize)

  // smmooth scroll
  $('.schedule-btn').click(smoothScroll)

  $('.instructor-btn').click(smoothScroll)

  $('.contact-btn').click(smoothScroll)

  $('.signup-btn').click(smoothScroll)
})
