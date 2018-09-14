// JS Code in TiDB Planet Pages

import Cookies from './vendor/js.cookie.js'
// https://github.com/js-cookie/js-cookie
import './vendor/jquery-dateformat.js'
// https://github.com/phstc/jquery-dateFormat

const prefix = '_tidb_planet_'
const cookiesKeyMap = {
  CONTRIBUTOR_NUM: `${prefix}contributor_num`,
  ISSUE_DATE: `${prefix}issue_date`,
  USERNAME: `${prefix}username`,
}

const getCookies = () => {
  let cookiesValMap = {}
  for (let ck in cookiesKeyMap) {
    const val = Cookies.get(cookiesKeyMap[ck])
    cookiesValMap[ck] = val
  }
  return cookiesValMap
}

const isAuthContributor = () => getCookies()['CONTRIBUTOR_NUM']

const usernameValidation = name => {
  var githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
  return githubUsernameRegex.test(name)
}

const authenticateContributor = name => {
  // load contributors json data
  if (!window.tidbContributors) {
    window.tidbContributors = $('.j-login').data('contributors')
  }

  if (window.tidbContributors[name]) {
    // success: is a contributor
    // sort by commit date
    const sortedContributors = _.toArray(window.tidbContributors).sort(
      (a, b) => {
        var dateA = a.first_commit_date.toLowerCase() // ignore upper and lowercase
        var dateB = b.first_commit_date.toLowerCase() // ignore upper and lowercase
        if (dateA < dateB) {
          return -1
        }
        if (dateA > dateB) {
          return 1
        }
        return 0
      }
    )

    const cNum = sortedContributors.indexOf(window.tidbContributors[name]) + 1
    const issueDate = window.tidbContributors[name].first_commit_date
    Cookies.set(cookiesKeyMap['CONTRIBUTOR_NUM'], cNum)
    Cookies.set(cookiesKeyMap['ISSUE_DATE'], issueDate)
    console.log(
      `Congratulations! You are the ${
        cNum
      }th landing on TiDB Planet! Issue Date: ${issueDate}`
    )
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
    const cNum = getCookies()['CONTRIBUTOR_NUM']
    $('.j-contributor-num').text(`${cNum}${ordinalAbbr(cNum)}`)
    // fill issue date
    const issueDate = getCookies()['ISSUE_DATE']
    $('.j-issue-date').text($.format.date(issueDate, 'MMM / dd / yyyy'))

    // fill residence card No.
    // pad number with specific value
    function pad(n, width, z) {
      z = z || '0'
      n = n + ''
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
    }
    // console.log(pad(cNum, 4))
    $('.j-rcard-id').text(
      `R${$.format.date(issueDate, 'MMddyyyy')}${pad(cNum, 4)}`
    )
  } else {
    $('.j-visitor').fadeIn()
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
      width: canvas.width / scale * 0.8 + 'px',
      height: canvas.height / scale * 0.8 + 'px',
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
