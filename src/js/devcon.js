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
  if (window.matchMedia('(max-width: 360px)').matches) {
    console.log('mobile')
    $('.architecture .skeleton').attr(
      'src',
      '/images/community/organization/lines-mobilei5.svg'
    )
  } else if (window.matchMedia('(max-width: 700px)').matches) {
    console.log('mobile')
    $('.architecture .skeleton').attr(
      'src',
      '/images/community/organization/lines-mobilei7.svg'
    )
  } else {
    console.log('pc')
    $('.architecture .skeleton').attr(
      'src',
      '/images/community/organization/lines-pc.svg'
    )
  }
}

function createDetailBlock(el) {
  console.log('el: ', el)
  var detailEle = document.createElement('div')
  detailEle.className = 'detail-bock'
  el.after(detailEle)
  console.log('detail:', detailEle)
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
  if (window.matchMedia('(max-width: 360px)').matches) {
    var h = w * 0.47
    var vertical_line_H_rattio = 0.11
  } else if (window.matchMedia('(max-width: 700px)').matches) {
    var h = w * 0.51
    var vertical_line_H_rattio = 0.11
  } else {
    var h = w / 3.17
    var vertical_line_H_rattio = 0.18
  }
  // var h = w / 3.17
  console.log('ar: ', w, h)
  var paddingR = parseInt($('.architecture').css('padding-right'))
  var paddingL = parseInt($('.architecture').css('padding-left'))
  var paddingT = parseInt($('.architecture').css('padding-top'))
  var paddingB = parseInt($('.architecture').css('padding-bottom'))

  // if()
  $('.head-node').css(
    'top',
    paddingT -
      $('.head-node').height() -
      2 * parseInt($('.head-node').css('padding-top'))
  )
  console.log(
    'head node tp: ',
    paddingT,
    parseInt($('.head-node').css('padding-top')),
    $('.head-node').height()
  )
  $('.head-node').css(
    'margin-left',
    -(
      $('.head-node').width() +
      2 * parseInt($('.head-node').css('padding-left'))
    ) / 2
  )

  $('.developer-group').css('top', h * vertical_line_H_rattio * 2 + paddingT)
  $('.developer-group').css(
    'margin-left',
    -(
      $('.developer-group').width() +
      2 * parseInt($('.developer-group').css('padding-left'))
    ) / 2
  )

  $('.pmc').css('top', h * vertical_line_H_rattio * 2 + paddingT)
  $('.pmc').css(
    'left',
    paddingL -
      ($('.pmc').width() +
        parseInt($('.pmc').css('padding-left')) +
        parseInt($('.pmc').css('padding-right'))) /
        2
  )

  $('.committee').css('top', h * vertical_line_H_rattio * 2 + paddingT)
  $('.committee').css(
    'margin-right',
    paddingR -
      ($('.committee').width() +
        parseInt($('.committee').css('padding-left')) +
        parseInt($('.committee').css('padding-right'))) /
        2
  )

  $('.maintainer').css(
    'top',
    // paddingB -
    //   $('.maintainer').height() -
    //   parseInt($('.maintainer').css('padding-top') * 2) +
    //   5
    paddingT + h
  )

  $('.maintainer').css(
    'margin-left',
    paddingL -
      ($('.maintainer').width() +
        parseInt($('.maintainer').css('padding-left')) +
        parseInt($('.maintainer').css('padding-right'))) /
        2
  )

  $('.committer').css(
    'top',
    // paddingB -
    //   $('.committer').height() -
    //   parseInt($('.committer').css('padding-top') * 2) +
    //   5
    paddingT + h
  )

  $('.committer').css(
    'margin-left',
    paddingL +
      w / 3 -
      ($('.committer').width() +
        parseInt($('.committer').css('padding-left')) +
        parseInt($('.committer').css('padding-right'))) /
        2
  )

  $('.contributor').css(
    'top',
    // paddingB -
    //   $('.contributor').height() -
    //   parseInt($('.contributor').css('padding-top') * 2) +
    //   5
    paddingT + h
  )
  $('.contributor').css(
    'margin-right',
    paddingR +
      w / 3 -
      ($('.contributor').width() +
        parseInt($('.contributor').css('padding-left')) +
        parseInt($('.contributor').css('padding-right'))) /
        2
  )

  $('.member').css(
    'top',
    // paddingB -
    //   $('.member').height() -
    //   parseInt($('.member').css('padding-top') * 2)
    paddingT + h
  )
  $('.member').css(
    'margin-right',
    paddingR -
      ($('.member').width() +
        parseInt($('.member').css('padding-left')) +
        parseInt($('.member').css('padding-right'))) /
        2
  )
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
