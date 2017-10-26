// JS Goes here - ES6 supported

// Say hello
console.log('🦊 Hello! @PingCAP website')
import '../../dist/css/style.css'

import './vendor/jquery.SimpleTree.js'
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
  $('.st_tree').SimpleTree({
    /* 可无视代码部分 */
    click: a => {
      if ($(a).attr('href') != '#') {
        $(a)
          .parent()
          .addClass('active')
        window.location = $(a).attr('href')
      }
    },
  })

  /* TOC for article in docs module  */
  const $tocWrap = $('.article-toc')
  if ($tocWrap.length) {
    toc_run()
  }

  /* tags frontend filter */
  // Todo restore selected state from hash
  $('.anchor-tag').click(function() {
    const $this = $(this)
    const filter = $this.data('tag')
  })
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
})
