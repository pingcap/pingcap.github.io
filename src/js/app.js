// JS Goes here - ES6 supported

// Say hello
console.log("🦊 Hello! @PingCAP website");

import './utils/jquery.SimpleTree.js';

$(function () {
  /* toggle wechat qr code */
  $('#wechat').hover( () => {
    $('#js_qr_code').toggleClass('f-hide');
  });

  /* scoll - fixed header */
  $(document).scroll(() => {
    $('#header').addClass('fixed-top');
    if($(document).scrollTop() == 0 )
      $('#header').removeClass('fixed-top');
  });

  /* sidebar */
  $(".st_tree").SimpleTree({
    /* 可无视代码部分 */
    click: (a) => {
      if (!$(a).attr("hasChild"))
        console.log($(a).attr("ref"));
      else {
        this.tree.find("li").removeClass("active");
        if ($(a).attr('href') != '#') {
          $(a).parent().addClass("active");
          window.location = $(a).attr('href');
        }
      }
    }
  });

  // FIXME: fixed?
  var oFixed = $('#draw_fixed');
  var doFixed = function () {
    var t = $(document).scrollTop(), opacityValue = 1 - .00175 * t;

    oFixed.css({
      opacity: opacityValue
    });
  };
  doFixed();
  $(window).scroll(doFixed);

  var eleBack = null, eleFront = null,

    eleList = $(".btn_translate"),
    nav_open = $('#nav_open');

  var funBackOrFront = function () {
    eleList.each(function () {
      if ($(this).hasClass("out")) {
        eleBack = $(this);
      } else {
        eleFront = $(this);
      }
    });
  };
  funBackOrFront();

  var flag = true;

  $(".outBtn").bind("click", function () {
    if (!flag) {
      return;
    }

    nav_open.toggleClass('nav_open');
    flag = false;

    eleFront.addClass("out").removeClass("in");
    setTimeout(function () {
      flag = true;
      eleBack.addClass("in").removeClass("out");

      funBackOrFront();
    }, 225);
    return false;
  });

  $('#group').on('click', function () {
    $(this).toggleClass('open');
  });

});
