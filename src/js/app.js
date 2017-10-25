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
  $('#st_tree').SimpleTree({
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

})
