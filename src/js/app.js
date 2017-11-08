// JS Goes here - ES6 supported

// Say hello
console.log('🦊 Hello! @PingCAP website')

import '../../dist/css/style.css'

import './vendor/jquery.SimpleTree.js'
import { run as toc_run } from './vendor/toc'

$(function() {
  /* toggle wechat qr code */
  const showQRCode = () => {
    $('#js_qr_code').removeClass('f-hide')
  }
  const hiddenQRCode = () => {
    $('#js_qr_code').addClass('f-hide')
  }
  $('#wechat').mouseover(showQRCode)
  $('#wechat').mouseout(hiddenQRCode)
  $('#wechat').on('tap', () => {
    $('#js_qr_code').toggleClass('f-hide')
  })

  /* scoll - fixed header */
  $(document).scroll(() => {
    $('#header').addClass('fixed-top')
    if ($(document).scrollTop() == 0) $('#header').removeClass('fixed-top')
  })

  /* sidebar */
  $('.st_tree').SimpleTree({
    click: a => {
      if ($(a).attr('href') != '#') {
        $(a)
          .parent()
          .addClass('active')
        window.location.href = $(a).attr('href')
      }
    },
  })

  /* TOC for article in docs module  */
  const $tocWrap = $('.article-toc')
  if ($tocWrap.length) {
    toc_run()
  }

  /* tags frontend filter */
  $('.nav-tags .tag, .anchor-tag').click(function(e) {
    const $this = $(this)
    const isInlineTag = $this.hasClass('anchor-tag')
    const isAll = $this.hasClass('all')
    const filter = isInlineTag ? $this.text().trim() : $this.data('tag')

    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${filter}"]`).addClass('sel')
    isAll && $('.tag.all').addClass('sel')
    $('.article-list .article').each(function() {
      const $this = $(this)
      if (isAll) {
        $this.show()
      } else {
        if ($this.data('tag').includes(filter)) {
          $this.show()
        } else {
          $this.hide()
        }
      }
    })
    e.preventDefault()
    return false
  })

  /* show search */
  $('.btn-search').click(function(e) {
    $('.search-wrapper').addClass('show')
    e.preventDefault()
    return false
  })

  /* hide search */
  $('.btn-cancel').click(function(e) {
    $('.search-wrapper').removeClass('show')
    e.preventDefault()
    return false
  })

  /* play video */
  // TODO: polish - use video.js
  const playVideo = () => {
    $('#video')[0].play()
    $('#video').attr('controls', 'controls')
  }

  $('#video-button').click(function(e) {
    $(this).toggleClass('f-hide')
    playVideo()
    e.preventDefault()
  })

  $('#video').click(function(e) {
    $('#video-button').toggleClass('f-hide')
    const $this = $(this)[0]
    $this.paused ? playVideo() : $this.pause()
    e.preventDefault()
  })

  /* anchor scroll */
  function scrollSection() {
    $('.st_tree a').click(function(e) {
      //Toggle Class
      $('.active').removeClass('active')
      $(this)
        .closest('li')
        .addClass('active')
      var theClass = $(this).attr('class')
      $('.' + theClass)
        .parent('li')
        .addClass('active')
      const targetID = $(this)
        .attr('href')
        .split('#')[1]
      const targetEl = $('#' + decodeURIComponent(targetID))
      const y = $('#header').height()

      if (targetID)
        // Animate
        $('html, body')
          .stop()
          .animate(
            {
              scrollTop: targetEl.offset().top - y,
            },
            400
          )
      // return false
    })
  }
  scrollSection()

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */

  // particlesJS('particles-js', particlesConfig, function() {
  //   console.log('callback - particles.js config loaded')
  // })
})
