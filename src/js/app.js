import { dynamicAddSubscribeForm } from './mailchimp'
import 'url-search-params-polyfill'
// JS Goes here - ES6 supported

// Global JS

// Say hello
console.log('🦊 Hello! @PingCAP website')
// const _ = require('lodash')

// import '../../dist/css/main.css'

// Smooth scrolling when the document is loaded and ready
function smoothScroll(hash) {
  const y = $('header').height()
  const marginTop = parseInt($(hash).css('marginTop'))
  if (hash && $(hash).offset())
    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top - y - marginTop,
      },
      1000
    )
}

// Process hash
function processHash() {
  const hash = decodeURIComponent(location.hash)
  if (!hash) return
  if ($('.nav-tags').length && $('.nav-tags').data('type') === 'list') return

  if (location.href.search('#access_token') < 0) {
    smoothScroll(hash)
  }
}

// Process release banner
function processReleaseBanner() {
  var version = $('.release-banner').data('release')

  if (typeof Storage !== 'undefined') {
    // Code for localStorage/sessionStorage.
    var releaseVerInStorage = localStorage.getItem(`release-version-${version}`)
    if (!releaseVerInStorage) $('.homepage').addClass('banner-active')
  } else {
    // Sorry! No Web Storage support..
    $('.homepage').addClass('banner-active')
  }

  $('.release-banner__close').click(function(e) {
    if ($('body.banner-active')) $('body').removeClass('banner-active')
    // set localStorage to record release banner version
    if (typeof Storage !== 'undefined') {
      var version = $('.release-banner').data('release')
      localStorage.setItem(`release-version-${version}`, version)
    }
    e.preventDefault()
  })
}

// Toggle weChat qr code
function toggleWeChatQRCode() {
  $('#wechat').click(e => {
    e.preventDefault()
    $('#wechat .qr_code_outer').toggleClass('f-hide')
  })
  $('#wechat-mobile').on('touchstart', e => {
    e.preventDefault()
    $('#wechat-mobile .qr_code_outer').toggleClass('f-hide')
  })

  $('.tidb-planet-robot, .contact-us-hack19').click(e => {
    e.preventDefault()
    $('.qr-tooltiptext').toggleClass('f-hide')
  })
  $('.tidb-planet-robot').on('touchstart', e => {
    e.preventDefault()
    $('.qr-tooltiptext').toggleClass('f-hide')
  })
}

function handleWindowScroll() {
  var scrollVal = $(this).scrollTop(),
    y = $('header').height()
  var amountScrolled = 200

  //process release banner in homepage
  if ($('body.banner-active') && scrollVal >= y) {
    $('body.banner-active').addClass('banner-active--scrolled')
  }
  if ($('body.banner-active--scrolled') && scrollVal < y) {
    $('body').removeClass('banner-active--scrolled')
  }
  // process back to top button
  if (scrollVal > amountScrolled) {
    $('.back-to-top').addClass('show')
  } else {
    $('.back-to-top').removeClass('show')
  }
}

function processMobileOverlay() {
  $('.nav-btn.nav-slider').click(function() {
    $('.overlay').show()
    $('nav').toggleClass('open')
  })
  $('.overlay').click(function() {
    if ($('nav').hasClass('open')) {
      $('nav').removeClass('open')
    }
    $(this).hide()
  })
}

// get TiDB contributors count
function getTidbContributorCount() {
  const url = 'https://pingcap.com/api/tidb-contributors'
  var count
  var countArr = []
  $.ajax({
    url,
    crossDomain: true,
    success: function(res) {
      window.tidbContributors = res.data
      if (res.data) {
        count = res.data.length
        const countLen = count.toString().length
        let s, q
        for (let i = countLen; i > 0; i--) {
          s = parseInt(count / Math.pow(10, i - 1))
          count = count % Math.pow(10, i - 1)
          countArr.push(s)
        }

        $('#tidb-contributor-count').append(
          countArr.map(
            c =>
              '<div class="numb">\
                <p>' +
              c +
              '</p>\
              </div>'
          )
        )
      }
    },
  })
}

$(document).ready(function() {
  processHash()

  if ($('body').data('lang') === 'cn') dynamicAddSubscribeForm()

  getTidbContributorCount()

  // Handle hash change
  $(window).on('hashchange', processHash)

  // Handle window scroll event
  $(window).scroll(handleWindowScroll)

  if ($('.homepage').length) processReleaseBanner()

  toggleWeChatQRCode()

  processMobileOverlay()

  // Handle click event on Back to top button
  $('.back-to-top').click(function() {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      800
    )
    return false
  })

  if (window.matchMedia('(max-width: 500px)').matches) {
    $('.docs-type-selector').click(function() {
      if ($('.header-dropdown-menu').css('display') == 'none') {
        $('.header-dropdown-menu').css('display', 'block')
      } else {
        $('.header-dropdown-menu').css('display', 'none')
      }
    })
  }
})
