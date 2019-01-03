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
  var header_H = $('header').height()
  if ($('header').length && !$('header').is(':hidden')) {
    $('.devcon-nav').css('top', header_H)
    $('.devcon-nav').css('height', header_H)
    $('.devCon').css('padding-top', 2 * header_H)
  } else {
    $('.devcon-nav').css('top', 0)
    $('.devcon-nav').css('height', header_H)
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

  $('.detail-block').hide()

  calcBtnPosition()

  // handle window scrolls
  $(window).scroll(handleWebsiteNavDisplay)

  //handle window resize
  $(window).resize(handleWindowResize)
  $(window).resize(calcBtnPosition)

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
    if ($('.dropdown-btns').css('display') == 'block') {
      $('.dropdown-btns').css('display', 'none')
    } else {
      $('.dropdown-btns').css('display', 'block')
    }
  })

  // handle devcon agenda talk title click, performing like collapse
  var selEle

  $('.agenda__table .collapsable').click(function() {
    if (window.matchMedia('(min-width: 550px)').matches) {
      if (selEle) {
        selEle.removeClass('selected-bg')
        selEle.children()[3].innerText = '+'
      }

      $(this).addClass('selected-bg')
      if ($(this).next()[0].style.display == 'none') {
        $('.detail-block').hide()
        $(this)
          .next()
          .show()
        $(this).children('td')[3].innerText = '-'
      } else {
        $(this)
          .next()
          .hide()
        $(this).removeClass('selected-bg')
        $(this).children('td')[3].innerText = '+'
      }

      selEle = $(this)
    }
  })
})
