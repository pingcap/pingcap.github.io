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

  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') ==
          this.pathname.replace(/^\//, '') &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var hash = decodeURIComponent(this.hash)
        var target = $(hash)
        target = target.length ? target : $('[name=' + hash.slice(1) + ']')
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault()
          const y = $('#header').height()
          $('html, body').animate(
            {
              scrollTop: target.offset().top - y,
            },
            1000,
            function() {
              // // Callback after animation
              // // Must change focus!
              // var $target = $(target)
              // $target.focus()
              // if ($target.is(':focus')) {
              //   // Checking if the target was focused
              //   return false
              // } else {
              //   $target.attr('tabindex', '-1') // Adding tabindex for elements not focusable
              //   $target.focus() // Set focus again
              // }
            }
          )
        }
      }
    })

  // Smooth scrolling when the document is loaded and ready
  $(document).ready(function() {
    const hash = decodeURIComponent(location.hash)
    const y = $('#header').height()
    if (hash)
      $('html, body').animate(
        {
          scrollTop: $(hash).offset().top - y,
        },
        1000
      )
  })

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
})
