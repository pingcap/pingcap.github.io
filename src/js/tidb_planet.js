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
  CONTRIBUTIONS: `${prefix}contributions`
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
    // fill contributor num
    const rank = getCookies()['CONTRIBUTIONS_RANK']
    $('.j-contributor-rank').text(`${rank}${ordinalAbbr(rank)}`)
    // fill contributions
    $('.j-contributions').text(getCookies()['CONTRIBUTIONS'])
    // fill date
    const _date = getCookies()['DATE']
    $('.j-date').text($.format.date(_date, 'MMM / dd / yyyy'))
    // set avatar url
    $('.j-avatar').attr("src", getCookies()['AVATAR'])
    // fill residence card No.
    // pad number with specific value
    function pad(n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }
    $('.j-rcard-id').text(`R${$.format.date(_date, 'MMddyyyy')}${pad(rank, 4)}`)
  } else {
    $('.j-visitor').fadeIn()
    $('.j-date').text($.format.date(_.now(), 'MMM / dd / yyyy'))
    $('.j-vcard-id').text(`R${$.format.date(_.now(), 'MMddyyyyhhmm')}`)
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

$(function() {
  // get username in cookie
  const username = getCookies()['USERNAME']
  if (!username) {
    // is a new user, not login
    console.log('Welcome to TiDB Planet! You are not logged in yet.')
    // show login button in every pages
    $('.j-login').show()

    if ($('body').hasClass('welcome-page')) {
      // TiDB Planet welcome page
      // TODO: open video modal and playing video
      // TODO: after playing video, show login modal and login button
    }
  } else if (isAuthContributor()) {
    // is a contributor
    if ($('body').hasClass('user-info-page')) showUserInfo('contributor')
  } else {
    // is a visitor
    if ($('body').hasClass('user-info-page')) showUserInfo('visitor')
  }

  // show nav in every pages
  $('.nav').fadeIn()

  // fade out popup
  setTimeout(()=>{
    $('.popup').fadeOut("slow")
  }, 3000)

  // buttons control
  // close modal button
  $('.close-modal').on('click', function(e) {
    $('.modal-overlay').fadeOut()
    $('.modal-overlay, .modal').removeClass('active')
    // reset login
    resetLogin()
    e.preventDefault()
  })
  // login button
  $('.j-login').on('click', function(e) {
    $('.nav__submenu').fadeOut()
    $('.j-login-overlay').fadeIn()
    $('.j-login-overlay, .modal').addClass('active')
    e.preventDefault()
  })
  // later button
  $('.j-later').on('click', function(e) {
    $('.nav__submenu').fadeOut()
    $('.j-login-overlay').fadeOut()
    $('.j-login-overlay, .modal').removeClass('active')
    // reset login
    resetLogin()
    e.preventDefault()
  })
  // show contributor list button
  $('.j-contributors-btn').on('click', function(e) {
    $('.nav__submenu').fadeOut()
    $('.j-contributors-overlay').fadeIn()
    $('.j-contributors-overlay, .modal').addClass('active')
    e.preventDefault()
  })
  // play video button
  $('.j-video-btn').on('click', function(e) {
    $('.nav__submenu').fadeOut()
    $('.j-video-overlay').fadeIn()
    $('.j-video-overlay, .modal').addClass('active')
    e.preventDefault()
  })
  // close popup button
  $('.j-close-popup').on('click', function(e) {
    $('.popup').fadeOut()
    e.preventDefault()
  })

  // close popup button
  $('.j-open-popup').on('click', function(e) {
    $('.popup').fadeIn()
    e.preventDefault()
  })

  const resetLogin = () => {
    $('.input-container .inner').removeClass('error')
    $('.input-container .inner').remove()
    $('.form__input').val(null)
  }

  // menu control
  $('.j-menu').on('click', function(e) {
    if ($('.nav__submenu').css('display') === 'none')
      $('.nav__submenu').fadeIn()
    else $('.nav__submenu').fadeOut()
    e.preventDefault()
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
