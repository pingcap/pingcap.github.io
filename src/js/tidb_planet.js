// JS Code in TiDB Planet Pages

import Cookies from './vendor/js.cookie.js'
// https://github.com/js-cookie/js-cookie
import './vendor/jquery-dateformat.js'
// https://github.com/phstc/jquery-dateFormat

// TODO: host server endpoint api with nodejs
// const url = 'http://localhost:5000/api/contributors'
const url = `/api/contributors`
$.ajax({
  url,
  crossDomain: true,
  success: function(res) {
    window.tidbContributors = res.data
    console.log(res)
  },
})

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
  // TODO: remove this
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

const isFirstAccess = () => !getCookies()['FIRST_ACCESS']

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

// set meteors

const setMeteors = () => {
  //generate meteors
  var meteors = document.getElementById('meteors')
  var meteor = document.getElementsByClassName('meteor')

  // js generate meteor randomly
  for (var j = 0; j < 2; j++) {
    var newMeteor = document.createElement('div')
    newMeteor.className = 'meteor'
    newMeteor.style.top = randomDistance(60, -30) + 'px'
    newMeteor.style.left = randomDistance(150, 20) + 'px'
    meteors.appendChild(newMeteor)
  }

  // generate top and left distance randomly
  function randomDistance(max, min) {
    var distance = Math.floor(Math.random() * (max - min + 1) * 10 + min)
    return distance
  }

  // add animation delay for meteors
  for (var i = 0, len = meteor.length; i < len; i++) {
    if (i % 6 == 0) {
      meteor[i].style.animationDelay = '0s'
    } else {
      meteor[i].style.animationDelay = i * 0.8 + 's'
    }
  }
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
      // show use guide mask
      Cookies.set(cookiesKeyMap['FIRST_ACCESS'], '-1')
      $('body').append('<div class="mask j-mask"></div>')

      // open video modal and playing video
      openVideoModal()

      // after playing video, show login modal and login button
      $('#video').on('ended', function() {
        console.log('Video has ended!')
        closeVideoModal()
        openLoginModal()
      })
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
    e.stopPropagation()
  })
  // open popup button
  $('.j-open-popup').on('click', function(e) {
    $('.popup').fadeIn()
    e.preventDefault()
    e.stopPropagation()
  })

  // read more click handler
  $('.j-readmore').on('click', function(e) {
    location.href = $(this).attr('href')
    e.preventDefault()
    e.stopPropagation()
  })

  // close mask
  $('.j-mask').on('click', function(e) {
    $(this).hide()
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

  setMeteors()
})
