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

// handle positions of devcon navbar and website navbar when resize window
function handleWindowResize() {
  // calculate devcon nav bar height
  var header_H = $('header').height()
  if ($('header').length && !$('header').is(':hidden')) {
    $('.devcon-nav').css('top', header_H)
    $('.devcon-nav').css('height', header_H)
    $('.devCon').css('padding-top', 2 * header_H)
  } else {
    $('.devcon-nav').css('top', 0)
    $('.devcon-nav').css('height', header_H)
  }

  // switch banner between pc and mobile
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

  // calculate architecture buttons positions
  var w = $('.architecture img').width()
  var h = w / 3.17
  $('.head-node').css('top', -(h * 0.18) + 110)
  $('.head-node').css('margin-left', -($('button.head-node').width() / 2) - 14)

  $('.developer-group').css('top', h * 0.36 + 95)
  $('.developer-group').css(
    'margin-left',
    -($('button.developer-group').width() / 2) - 14
  )

  $('.pmc').css('top', h * 0.36 + 95)
  // $('.pmc').css('margin-left', -$('.pmc').width() / 2 + 25)

  $('.committee').css('top', h * 0.36 + 95)
  // $('.committee').css('margin-right', -($('.committee').width() / 2 + 35))

  $('.maintainer').css('bottom', -$('.maintainer').height() + 75)
  // $('.maintainer').css('margin-left', -$('.maintainer').width() / 2 + 25)

  $('.committer').css('bottom', -$('.committer').height() + 75)
  $('.committer').css(
    'margin-left',
    -w * 0.167 - $('.committer').width() / 2 - 25
  )

  $('.contributor').css('bottom', -$('.contributor').height() + 76)
  $('.contributor').css(
    'right',
    w * 0.33 + 50 - $('.contributor').width() / 2 - 20
  )

  $('.member').css('bottom', -$('.member').height() + 75)
  // $('.member').css('margin-right', -$('.member').width() / 2 - 35)
  // $('.committer').css('bottom')

  console.log('.width()', $('button.head-node').width())
}

// handle pr-content collapse
function handlePRConCollapse() {
  if ($('.guide-content').css('display') == 'block') {
    $('.subtitle-guide').css('color', '#3e3e3e')
    $('.guide-content').hide()
    $('#guide-collapse')[0].innerText = '+'
  }

  if ($('.pr-content').css('display') == 'block') {
    $('.subtitle-pr').css('color', '#3e3e3e')
    $('.pr-content').hide()
    $('#pr-collapse')[0].innerText = '+'
  } else {
    $('.subtitle-pr').css('color', '#3A58F0')
    $('.pr-content').show()
    $('#pr-collapse')[0].innerText = '-'
  }
}

// handle guide-content collapse
function handleGuideConCollapse() {
  if ($('.pr-content').css('display') == 'block') {
    $('.subtitle-pr').css('color', '#3e3e3e')
    $('.pr-content').hide()
    $('#pr-collapse')[0].innerText = '+'
  }

  if ($('.guide-content').css('display') == 'block') {
    $('.subtitle-guide').css('color', '#3e3e3e')
    $('.guide-content').hide()
    $('#guide-collapse')[0].innerText = '+'
  } else {
    $('.subtitle-guide').css('color', '#3A58F0')
    $('.guide-content').show()
    $('#guide-collapse')[0].innerText = '-'
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

  handleWindowResize()

  // handle window scrolls
  $(window).scroll(handleWebsiteNavDisplay)

  //handle window resize
  $(window).resize(handleWindowResize)
  // $(window).resize(calcBtnPosition)

  // smmooth scroll
  $('.schedule-btn').click(smoothScroll)

  $('.instructor-btn').click(smoothScroll)

  $('.contact-btn').click(smoothScroll)

  $('.signup-btn').click(smoothScroll)

  $('.instructor').click(function() {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      $('.intro').css('opacity', '0')
      var el = $(this)
        .find('.intro')
        .css('opacity', '1')
    }
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

  $('.subtitle-pr').click(handlePRConCollapse)

  $('.subtitle-guide').click(handleGuideConCollapse)

  $('.committer').click(function() {
    $('html, body').animate(
      {
        scrollTop: $('.committer__detail').offset().top - 80,
      },
      1000
    )
  })

  $('.contributor').click(function() {
    $('html, body').animate(
      {
        scrollTop: $('.contributor__detail').offset().top - 70,
      },
      1000
    )
  })
})
