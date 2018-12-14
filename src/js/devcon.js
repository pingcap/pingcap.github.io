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
  console.log('scroll')
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
  if (window.matchMedia('(max-width: 1100px)').matches) {
    $('.banner .image img').attr(
      'src',
      '/images/community/devcon-banner-mobile.png'
    )
  } else {
    $('.banner .image img').attr(
      'src',
      '/images/community/devcon-banner-pc.png'
    )
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

  $('.instructor').click(function() {
    $('.intro').css('opacity', '0')
    var el = $(this)
      .find('.intro')
      .css('opacity', '1')
  })

  $('.instructor').hover(function() {
    $('.intro').css('opacity', '0')

    var el = $(this)
      .find('.intro')
      .css('opacity', '1')
  })

  $('.section-burger').click(function() {
    // $('.dropdown-btns').css('opacity', '0')
    console.log('dropdown clicked')
    // val el = $(this).find('.dropdown-btns').css('display', '1')
    // if ($('.dropdown-btns').attr('opacity')) {
    // }
    // console.log('attr: ', $('.dropdown-btns').attr('opacity'))
    // $(this).css('opacity', '0.5')
    // console.log('burger clicked')
  })
})
