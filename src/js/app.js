// JS Goes here - ES6 supported

// Say hello
console.log('🦊 Hello! @PingCAP website')

import '../../dist/css/style.css'

import './vendor/jquery.SimpleTree.js'
import { run as toc_run } from './vendor/toc'

var blogRegex = /\/blog(-cn)?\//gi
var recruitRegex = /\/recruit(-cn)?\//gi

function smoothScroll(hash) {
  /* Smooth scrolling when the document is loaded and ready */
  const y = $('header.header').height()
  if (hash && $(hash).offset())
    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top - y,
      },
      1000
    )
}

// enable javascript
$(document).ready(function() {
  /* content pre-loading */
  $(window).on('load', function() {
    $('.loading-container').hide()
    $('.content-container').show()
    $('.loading-item').hide()
    $('.list-item').css('opacity', '1')
    $('.st_tree').fadeIn()
  })

  $(window).on('hashchange', function() {
    const hash = decodeURIComponent(location.hash)
    if (
      (location.pathname.match(blogRegex) ||
        location.pathname.match(recruitRegex)) &&
      $('.nav-tags').data('type') !== 'single'
    )
      return
    if (hash) smoothScroll(hash)
  })

  /* TOC for article in docs module */
  const $tocWrap = $('.article-toc')
  if ($tocWrap.length) {
    toc_run()
  }

  /* process tags */
  const hash = decodeURIComponent(location.hash)
  if (
    (location.pathname.match(blogRegex) ||
      location.pathname.match(recruitRegex)) &&
    hash
  ) {
    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${hash.slice(1)}"]`).addClass('sel')
    $('.article-list .article').each(function() {
      const $this = $(this)
      if ($this.data('tag').includes(hash.slice(1))) {
        $this.show()
      } else {
        $this.hide()
      }
    })
  } else {
    const pageTpye = $('.nav-tags').data('type')
    if (pageTpye !== 'single') {
      $('.tag.all').addClass('sel')
    }
    if (hash) {
      smoothScroll(hash)
    }
  }

  /* tree sidebar */
  $('.st_tree').SimpleTree({
    click: a => {
      if ($(a).attr('href') != '#') {
        $(a)
          .parent()
          .parent()
          .find('.active')
          .removeClass('active')
        $(a)
          .parent()
          .addClass('active')
        window.location.href = $(a).attr('href')
      }
    },
  })

  /* tags frontend filter */
  $('.nav-tags .tag, .anchor-tag').click(function(e) {
    const $this = $(this)
    const isInlineTag = $this.hasClass('anchor-tag')
    const isAll = $this.hasClass('all')
    const filter = isInlineTag ? $this.text().trim() : $this.data('tag')

    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${filter}"]`).addClass('sel')
    isAll && $('.tag.all').addClass('sel')

    const pageTpye = $('.nav-tags').data('type')
    console.log(pageTpye)
    if (pageTpye && pageTpye === 'single') {
      if (isAll) window.location.href = '../'
      else window.location.href = `../#${encodeURIComponent(filter)}`
    } else {
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
      if (isAll) window.location.href = `./`
      else window.location.href = `./#${encodeURIComponent(filter)}`
    }

    e.preventDefault()
    return false
  })

  /* play video */
  // TODO: polish - use video.js
  const playVideo = () => {
    $('#video').attr('controls', 'controls')
    // for safari
    var promise = document.getElementById('video').play()
    if (promise !== undefined) {
      promise
        .then(_ => {
          // Autoplay started!
        })
        .catch(error => {
          // Autoplay was prevented.
          // Show a "Play" button so that user can start playback.
        })
    }
  }
  $('#video-control').click(function(e) {
    const videoEl = document.getElementById('video')
    if (videoEl.paused) {
      $(this).css('opacity', '0')
      playVideo()
    } else {
      $(this).css('opacity', '1')
      videoEl.pause()
    }
    e.preventDefault()
  })
  $('#video').focus(function(e) {
    $(this).attr('controls', 'controls')
    e.preventDefault()
  })

  /* open first item in docs/docs-cn/weekly list page */
  const openFolder = li => {
    if (li.hasClass('has-child')) {
      li.addClass('open')
      const $firstUL = li.find('ul')[0]
      const $LI = $($firstUL)
        .attr('style', 'display: block;')
        .find('li:first-child')
      return openFolder($LI)
    }
    li.addClass('active')
    return false
  }
  const $firstLI = $('#list_page .st_tree > ul > li:first-child')
  openFolder($firstLI)

  /* markdown-body tag a ref */
  function replaceHref(a) {
    var href = $(a).attr('href')
    var absUrlExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
      mdSuffixExp = /\.md/

    var absUrlRegex = new RegExp(absUrlExp),
      mdSuffixRegex = new RegExp(mdSuffixExp)

    if (!href.match(absUrlRegex) && href.match(mdSuffixRegex)) {
      // ref
      var newHref = '../' + href.replace(/\.md/, '')
      $(a).attr('href', newHref)
    }
  }
  $('.markdown-body')
    .find('a')
    .each(function() {
      var $this = $(this)
      // click event
      $this.click(function(e) {
        replaceHref(this)
      })
      // right click event for open in new window or copy link url
      $this.contextmenu(function(e) {
        replaceHref(this)
      })
    })

  /* toggle wechat qr code */
  $('#wechat').on('click', e => {
    e.preventDefault()
    $('#wechat .qr_code_outer').toggleClass('f-hide')
  })
  $('#wechat-mobile').on('touchstart', e => {
    e.preventDefault()
    $('#wechat-mobile .qr_code_outer').toggleClass('f-hide')
  })

  /* hide search suggestions dropdown menue on focusout */
  $('#search-input').focusout(function() {
    $('.ds-dropdown-menu').hide()
  })
  /* show search suggestions dropdown menue on focus */
  $('#search-input').focus(function(e) {
    e.preventDefault()
    if (e.target && e.target.value) $('.ds-dropdown-menu').show()
  })

  /* toggle mobile sidebar */
  $('.nav-btn.nav-slider').on('click', function() {
    $('.overlay').show()
    $('nav').toggleClass('open')
  })

  $('.overlay').on('click', function() {
    if ($('nav').hasClass('open')) {
      $('nav').removeClass('open')
    }
    $(this).hide()
  })
})
