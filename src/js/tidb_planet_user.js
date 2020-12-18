import { getCookies } from './utils/cookies'
import './vendor/jquery-dateformat.js'
// https://github.com/phstc/jquery-dateFormat

// convert html to canvas, then convert canvas to image
const convert2image = () => {
  var shareContent = document.body
  var width = shareContent.offsetWidth
  var height = shareContent.offsetHeight
  var scale = 3
  var canvas = document.createElement('canvas')

  // fix font issue
  shareContent.style.fontFeatureSettings = '"liga" 0'

  canvas.width = width * scale
  canvas.height = height * scale
  canvas.getContext('2d').scale(scale, scale) //获取context,设置scale

  var opts = {
    scale: scale,
    canvas: canvas,
    useCORS: true,
    logging: true,
    letterRendering: true,
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
    $('.j-date').text($.format.date(_date, 'dd / MMM / yyyy'))
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
    $('.j-rcard-id').text(`R${$.format.date(_date, 'ddMMyyyy')}${pad(rank, 4)}`)
    // fill contributions rank
    $('.j-greetings').html(
      `Congratulations!<br />You rank <strong style="font-size:1.1em;">${
        rank
      }${ordinalAbbr(rank)}</strong> on TiDB Planet!`
    )
  } else {
    $('.j-visitor').fadeIn()
    $('.j-date').text($.format.date(_.now(), 'dd / MMM / yyyy'))
    $('.j-vcard-id').text(`R${$.format.date(_.now(), 'ddMMyyyyhhmm')}`)
    $('.j-greetings').text(
      'Welcome to the TiDB Planet. Join us now! www.pingcap.com'
    )
  }
}

const openCaptureLayer = () => {
  if ($('body')[0].offsetWidth < 768)
    $('.html2image-container').addClass('show')
}

$(function() {
  if (!getCookies()['USERNAME']) {
    // new user
    // make astronaut clickable
    $('.element-astronaut').addClass('j-login j-click')
    // open login modal
    $('.j-login-overlay').fadeIn()
    $('.j-login-overlay, .modal').addClass('active')
    $('.j-greetings').text(
      'Hope you enjoy our journey together and may the open source be with you!'
    )
  } else if (getCookies()['CONTRIBUTIONS_RANK']) {
    // is a contributor
    showUserInfo('contributor')
    openCaptureLayer()
  } else {
    // is a visitor
    showUserInfo('visitor')
    openCaptureLayer()
  }

  // login button
  $('.j-login').on('click', function(e) {
    $('.j-login-overlay').fadeIn()
    $('.j-login-overlay, .modal').addClass('active')
    e.preventDefault()
    e.stopPropagation()
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
      '<div class="share-section"><div class="text">Scan the QR Code to explore more about TiDB!</div><img src="/images/tidb-planet/share-qrcode.png" alt="" /></div>'
    )
    // open capture overlay
    $('.j-capture-overlay').fadeIn()
    $('.j-capture-overlay, .modal').addClass('active')

    convert2image()
  })
})
