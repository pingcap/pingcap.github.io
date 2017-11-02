// JS Goes here - ES6 supported

// Say hello
console.log('🦊 Hello! @PingCAP website')
import '../../dist/css/style.css'

import './vendor/jquery.SimpleTree.js'
// import Stickyfill from './vendor/stickyfill.es6.js'
import { run as toc_run, extract as toc_extract } from './vendor/toc'

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

  // // sticky sidebar
  // const elements = $('.sticky-nav')
  // Stickyfill.add(elements)

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
})
