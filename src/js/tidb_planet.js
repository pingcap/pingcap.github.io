// JS Code in TiDB Planet Pages

// import Cookies from './vendor/js.cookie.js'
import { getCookies, setCookies } from './cookies.js'
// https://github.com/js-cookie/js-cookie
// import './vendor/jquery-dateformat.js'
// // https://github.com/phstc/jquery-dateFormat

const url = 'https://pingcap.com/api/contributors'
$.ajax({
  url,
  crossDomain: true,
  success: function(res) {
    window.tidbContributors = res.data
    if (res.data) {
      $('.j-amount').text(res.data.length)
      $('.j-show').show()
    }
  },
})

// const isAuthContributor = () => getCookies()['CONTRIBUTIONS_RANK']

const usernameValidation = name => {
  var githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
  return githubUsernameRegex.test(name)
}

const authenticateContributor = name => {
  const _index = window.tidbContributors.findIndex(c => c.login === name)

  if (_index > -1) {
    // success: is a contributor
    const c = window.tidbContributors[_index]
    setCookies('CONTRIBUTIONS_RANK', _index + 1)
    setCookies('DATE', c.date)
    setCookies('CONTRIBUTIONS', c.contributions)
    setCookies('AVATAR', c.avatar_url)
  } else {
    // failed: is a visitor
    console.log('Welcome to the TiDB planet, join us now! www.pingcap.com')
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
  // auto play video
  const promise = document.querySelector('video').play()
  if (promise !== undefined) {
    promise
      .catch(error => {
        // Auto-play was prevented
        // Show a UI element to let the user manually start playback
        console.log('Auto-play was prevented by browser')
      })
      .then(() => {
        // Auto-play started
      })
  }
  autoPlayVideoInWeXin()
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

// set contributor item dom
const setItem = item => {
  const getDegree = n => {
    if (n >= 0 && n <= 5) return 1
    if (n >= 6 && n <= 10) return 2
    if (n >= 11 && n <= 20) return 3
    else return 4
  }
  const contributorItemEl = `\
  <div class="list__item">\
    <div class="github-avatar">\
      <img src="${item.avatar_url}" width="36px" height="36px"/>\
    </div>\
    <div class="contributor-info">\
      <div class="contributor-name"><a href="https://github.com/${
        item.login
      }" target="_blank">${item.login}</a></div>\
      <div class="contribution-degree" data-degree="${getDegree(
        item.contributions
      )}">\
        <span class="dot dot-1"></span>\
        <span class="dot dot-2"></span>\
        <span class="dot dot-3"></span>\
        <span class="dot dot-4"></span>\
      </div>\
    </div>\
  </div> `
  $('#contributors').append(contributorItemEl)
}
// process contributor list modal
const setContributorsList = index => {
  let contributors = window.tidbContributors
  // sort by name
  contributors.sort(function(a, b) {
    var nameA = a.login.toUpperCase() // ignore upper and lowercase
    var nameB = b.login.toUpperCase() // ignore upper and lowercase
    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }

    // names must be equal
    return 0
  })
  const d = _.floor(contributors.length / 5)
  let innerList = []

  contributors.forEach((value, key) => {
    if (index < 4) {
      if (key >= index * d && key < (index + 1) * d) innerList.push(value)
    } else {
      if (key >= index * d) innerList.push(value)
    }
  })

  innerList.forEach(value => {
    setItem(value)
  })
}

const autoPlayVideoInWeXin = () => {
  document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    $('#video')[0].play()
  })
}

const closeModal = () => {
  const modalType = $('.modal-overlay.active').data('type')
  $('.modal-overlay').fadeOut()
  $('.modal-overlay, .modal').removeClass('active')
  // reset login
  if (modalType === 'login') resetLogin()
  // pause video
  if (modalType === 'video') $('#video')[0].pause()
  // reset contributor list dom
  if (modalType === 'contributors') $('#contributors').html('')
  if (modalType === 'capture') $('.html2image-container').removeClass('show')
}

$(function() {
  if ($('body').hasClass('welcome-page') && !isFirstAccess()) {
    // show guide tip
    $('body').append(
      '<div class="guide-again scale-in-center">Click these elements and explore the planet again!</div>'
    )
  }

  // get username in cookie
  const username = getCookies()['USERNAME']
  if (!username) {
    // is a new user, not login
    // show login button in every pages (PC only)
    $('.j-login').show()

    // is first time accessing TiDB Planet welcome page
    if ($('body').hasClass('welcome-page') && isFirstAccess()) {
      // show use guide mask
      setCookies('FIRST_ACCESS', '-1')
      $('body').append('<div class="mask j-mask"></div>')
      // open video modal and playing video
      // openVideoModal()
    }
  }

  if ($('body').hasClass('milestones-page')) openVideoModal()
  // only show nav and next forward animation in PC pages
  if ($('body')[0].offsetWidth > 768) {
    $('.nav').fadeIn()
    $('.j-forward').addClass('animation-forward_arrow')
  }

  // fade out popup
  setTimeout(() => {
    $('.j-fadeOutSlowly').fadeOut('slow')
  }, 5000)

  // after playing video
  $('#video').on('ended', function() {
    console.log('Video has ended!')
    closeVideoModal()
  })

  // close modal button
  $('.close-modal')
    .off('click')
    .on('click', function(e) {
      // const modalType = $('.modal-overlay.active').data('type')
      // $('.modal-overlay').fadeOut()
      // $('.modal-overlay, .modal').removeClass('active')
      // // reset login
      // if (modalType === 'login') resetLogin()
      // // pause video
      // if (modalType === 'video') $('#video')[0].pause()
      // // reset contributor list dom
      // if (modalType === 'contributors') $('#contributors').html('')
      // if (modalType === 'capture')
      //   $('.html2image-container').removeClass('show')
      closeModal()
      e.preventDefault()
      e.stopPropagation()
    })

  $('.modal-overlay').on('click', function(e) {
    if ($(this).hasClass('active')) {
      // const _target = e.target
      // console.log('current target', e.target)
      // console.log('current delegateTarget', e.delegateTarget)
      if (_.isEqual(e.target, e.delegateTarget)) closeModal()
      // e.preventDefault()
      // e.stopPropagation()
    }
  })

  // login button
  $('.j-login').on('click', function(e) {
    openLoginModal()
    e.preventDefault()
    e.stopPropagation()
  })
  // later button
  $('.j-later').on('click', function(e) {
    closeLoginModal()
    e.preventDefault()
    e.stopPropagation()
  })
  // show contributor list button
  $('.j-open-dorm')
    .off('click')
    .on('click', function(e) {
      const index = $(this).data('index')
      setContributorsList(index)
      $(`.j-contributors-overlay`).fadeIn()
      $(`.j-contributors-overlay, .modal`).addClass('active')
      e.preventDefault()
      e.stopPropagation()
    })
  // play video button
  $('.j-video-btn').on('click', function(e) {
    openVideoModal()
    e.preventDefault()
    e.stopPropagation()
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
    // location.href = $(this).attr('href')
    const lang = navigator.language
    if (lang.substring(0, 2) == 'zh') {
      $(this).attr('href', 'https://pingcap.com/docs-cn/releases/2.0.11/')
    }
    window.open($(this).attr('href'))
    e.preventDefault()
    e.stopPropagation()
  })

  // close mask - disabled
  // $('.j-mask').on('click', function(e) {
  //   $(this).hide()
  //   e.preventDefault()
  //   e.stopPropagation()
  // })

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
      setCookies('USERNAME', inputName)

      setTimeout(() => {
        location.href = '/tidb-planet/user/'
      }, 2000)
    }

    e.preventDefault()
  })

  setMeteors()
})
