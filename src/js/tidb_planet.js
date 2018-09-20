// JS Code in TiDB Planet Pages

import Cookies from './vendor/js.cookie.js'
// https://github.com/js-cookie/js-cookie
import './vendor/jquery-dateformat.js'
// https://github.com/phstc/jquery-dateFormat

// TODO: host server endpoint api with nodejs
// const url = 'http://localhost:5000/api/contributors'
// $.ajax({
//   url: `/api/contributors`,
//   crossDomain: true,
//   success: function(data) {
//   console.log(data)
// }})

const prefix = '_tidb_planet_'
const cookiesKeyMap = {
  CONTRIBUTIONS_RANK: `${prefix}contributions_rank`,
  USERNAME: `${prefix}username`,
  DATE: `${prefix}date`,
  AVATAR: `${prefix}avatar_url`,
  CONTRIBUTIONS: `${prefix}contributions`,
  FIRST_ACCESS: `${prefix}first_access`,
}

const getCookies = () => {
  let cookiesValMap = {}
  for (let ck in cookiesKeyMap) {
    const val = Cookies.get(cookiesKeyMap[ck])
    cookiesValMap[ck] = val
  }
  return cookiesValMap
}

const isAuthContributor = () => getCookies()['CONTRIBUTIONS_RANK']

const usernameValidation = name => {
  var githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
  return githubUsernameRegex.test(name)
}

const authenticateContributor = name => {
  // load contributors json data
  if (!window.tidbContributors) {
    window.tidbContributors = $('.j-login').data('contributors')
  }

  const _index = window.tidbContributors.findIndex(c => c.login === name)

  if (_index > -1) {
    // success: is a contributor
    const c = window.tidbContributors[_index]
    Cookies.set(cookiesKeyMap['CONTRIBUTIONS_RANK'], _index + 1)
    Cookies.set(cookiesKeyMap['DATE'], c.date)
    Cookies.set(cookiesKeyMap['CONTRIBUTIONS'], c.contributions)
    Cookies.set(cookiesKeyMap['AVATAR'], c.avatar_url)
  } else {
    // failed: is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
  }
}

// generate numerical order abbr.
const ordinalAbbr = number => {
  var b = number % 10
  return ~~((number % 100) / 10) === 1
    ? 'th'
    : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th'
}

// process user info page
const showUserInfo = type => {
  // fill username
  $('.j-username').text(getCookies()['USERNAME'])

  if (type === 'contributor') {
    $('.j-contributor').fadeIn()
    // fill contributions
    $('.j-contributions').text(getCookies()['CONTRIBUTIONS'])
    // fill date
    const _date = getCookies()['DATE']
    $('.j-date').text($.format.date(_date, 'MMM / dd / yyyy'))
    // set avatar url
    $('.j-avatar').attr('src', getCookies()['AVATAR'])

    // pad number with specific value
    function pad(n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }
    // fill residence card No.
    const rank = getCookies()['CONTRIBUTIONS_RANK']
    $('.j-rcard-id').text(`R${$.format.date(_date, 'MMddyyyy')}${pad(rank, 4)}`)
    // fill contributions rank
    $('.j-greetings').text(
      `Congratulation! You rank ${rank}${ordinalAbbr(rank)} on TiDB Planet!`
    )
  } else {
    $('.j-visitor').fadeIn()
    $('.j-date').text($.format.date(_.now(), 'MMM / dd / yyyy'))
    $('.j-vcard-id').text(`R${$.format.date(_.now(), 'MMddyyyyhhmm')}`)
    $('.j-greetings').text(
      'Welcome to the TiDB planet, join us now! www.pingcap.com'
    )
  }
}

// convert html to canvas, then convert canvas to image
const convert2image = () => {
  var shareContent = document.body
  var width = shareContent.offsetWidth
  var height = shareContent.offsetHeight
  var scale = 3
  var canvas = document.createElement('canvas')

  canvas.width = width * scale
  canvas.height = height * scale
  canvas.getContext('2d').scale(scale, scale) //获取context,设置scale

  var opts = {
    scale: scale,
    canvas: canvas,
    useCORS: true,
    logging: true,
    width: width,
    height: height,
  }

  html2canvas(shareContent, opts).then(function(canvas) {
    $('.share-section').remove()

    var context = canvas.getContext('2d')

    // 【重要】关闭抗锯齿
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.msImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

    // convert to PNG by default
    // var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height)
    // convert to JPEG
    // 安卓版微信中所生成的图片尽管能长按唤出保存图片的菜单，但是无法正确保存到本地相册。
    // 解决方案：设置canvas2img的生成图片格式配置项为 JPEG 即可。
    var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height)

    $('.j-capture-image').html(img)

    $(img).css({
      width: canvas.width / scale * 0.6 + 'px',
      height: canvas.height / scale * 0.6 + 'px',
    })
  })
}

// TODO: fisrt access
const isFirstAccess = () => {
  return true
}

const resetLogin = () => {
  $('.input-container .inner').removeClass('error')
  $('.input-container .inner').remove()
  $('.form__input').val(null)
}

const openLoginModal = () => {
  $('.j-login-overlay').fadeIn()
  $('.j-login-overlay, .modal').addClass('active')
}

const closeLoginModal = () => {
  $('.j-login-overlay').fadeOut()
  $('.j-login-overlay, .modal').removeClass('active')
  // reset login
  resetLogin()
}

const openVideoModal = () => {
  $('.j-video-overlay').fadeIn()
  $('.j-video-overlay, .modal').addClass('active')
  // play video
  setTimeout(() => {
    $('#video')[0].play()
  }, 600)
}

const closeVideoModal = () => {
  $('.j-video-overlay').fadeOut()
  $('.j-video-overlay, .modal').removeClass('active')
}

$(function() {
  // get username in cookie
  const username = getCookies()['USERNAME']
  if (!username) {
    // is a new user, not login
    // show login button in every pages (PC only)
    $('.j-login').show()

    // is first time accessing TiDB Planet welcome page
    if ($('body').hasClass('welcome-page') && isFirstAccess()) {
      // TODO: open video modal and playing video
      openVideoModal()

      // TODO: after playing video, show login modal and login button
      $('#video').on('ended', function() {
        console.log('Video has ended!')
        closeVideoModal()
        openLoginModal()
      })

      // TODO: show first time use guide
    }
    // User info page
    if ($('body').hasClass('user-info-page')) {
      // open login modal
      openLoginModal()
      // make astronaut clickable
      $('.element-astronaut').addClass('j-login j-click')
      $('.j-greetings').text(
        'Hope you enjoy our journey together and may the open source be with you!'
      )
    }
  } else if (isAuthContributor()) {
    // is a contributor
    if ($('body').hasClass('user-info-page')) showUserInfo('contributor')
  } else {
    // is a visitor
    if ($('body').hasClass('user-info-page')) showUserInfo('visitor')
  }

  // only show nav in PC pages
  if ($('body')[0].offsetWidth > 768) $('.nav').fadeIn()

  // fade out popup
  setTimeout(() => {
    $('.j-fadeOutSlowly').fadeOut('slow')
  }, 3000)

  // buttons control
  // close modal button
  $('.close-modal').on('click', function(e) {
    const modalType = $('.modal-overlay.active').data('type')
    $('.modal-overlay').fadeOut()
    $('.modal-overlay, .modal').removeClass('active')
    // reset login
    if (modalType === 'login') resetLogin()
    // pause video
    if (modalType === 'video') $('#video')[0].pause()
    e.preventDefault()
  })
  // login button
  $('.j-login').on('click', function(e) {
    openLoginModal()
    e.preventDefault()
  })
  // later button
  $('.j-later').on('click', function(e) {
    closeLoginModal()
    e.preventDefault()
  })
  // show contributor list button
  $('.j-open-dorm').on('click', function(e) {
    const index = $(this).data('index')
    $(`.j-contributors${index}-overlay`).fadeIn()
    $(`.j-contributors${index}-overlay, .modal`).addClass('active')
    e.preventDefault()
  })
  // play video button
  $('.j-video-btn').on('click', function(e) {
    openVideoModal()
    e.preventDefault()
  })
  // close popup button
  $('.j-popup').on('click', function(e) {
    $('.popup').fadeOut()
    e.preventDefault()
    e.stopPropagation();
  })
  // open popup button
  $('.j-open-popup').on('click', function(e) {
    $('.popup').fadeIn()
    e.preventDefault()
    e.stopPropagation()
  })

  // redamore click handler
  $('.j-readmore').on('click', function(e) {
    location.href = $(this).attr('href')
    e.preventDefault()
    e.stopPropagation()
  })

  // input validation
  $('.form__input').blur(function() {
    if (!usernameValidation($(this).val()) && !$('.error').length) {
      $('.input-container').append(
        '<span class="inner" >' + 'Please enter a valid username.' + '</span>'
      )
      setTimeout(() => {
        $('.input-container .inner').addClass('error')
      }, 100)
    }
  })
  $('.form__input').focus(function() {
    $('.input-container .inner').removeClass('error')
    $('.input-container .inner').remove()
  })

  //  form submit handler: login authentication
  $('.form').submit(function(e) {
    $('.form__input').blur()
    const inputName = $('.form__input').val()

    if (usernameValidation(inputName)) {
      $('.modal-login').addClass('landing')

      authenticateContributor(inputName)
      // create a cookie about username
      Cookies.set(cookiesKeyMap['USERNAME'], inputName)

      setTimeout(() => {
        location.href = '/tidb-planet/user/'
      }, 2000)
    }

    e.preventDefault()
  })

  // camera button
  $('.j-camera').on('click', function() {
    if ($('.html2image-container').hasClass('show'))
      $('.html2image-container').removeClass('show')
    else $('.html2image-container').addClass('show')
  })
  // capture picture button
  $('.j-capture').on('click ', function() {
    // add share section
    $('.html2image-section').append(
      '<div class="share-section"><div class="text">Scan the QR Code to explore more about TiDB!</div><img src="/images/qrcode-min.jpg" alt="" /></div>'
    )
    // open capture overlay
    $('.j-capture-overlay').fadeIn()
    $('.j-capture-overlay, .modal').addClass('active')

    // TODO: need to remove all animations before convert to image
    convert2image()
  })
})
