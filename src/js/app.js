// JS Goes here - ES6 supported

// Say hello
console.log("🦊 Hello! @PingCAP website")

import './utils/jquery.SimpleTree.js'

$(function () {
  /* toggle wechat qr code */
  $('#wechat').hover( () => {
    $('#js_qr_code').toggleClass('f-hide')
  })

  /* scoll - fixed header */
  $(document).scroll(() => {
    $('#header').addClass('fixed-top')
    if($(document).scrollTop() == 0 )
      $('#header').removeClass('fixed-top')
  })

  /* sidebar */
  $(".st_tree").SimpleTree({
    /* 可无视代码部分 */
    click: (a) => {
      if (!$(a).attr("hasChild"))
        console.log($(a).attr("ref"))
      else {
        $(this).find("li").removeClass("active")
        if ($(a).attr('href') != '#') {
          $(a).parent().addClass("active")
          window.location = $(a).attr('href')
        }
      }
    }
  })
  
})
