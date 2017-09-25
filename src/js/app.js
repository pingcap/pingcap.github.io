// JS Goes here - ES6 supported

// Say hello
console.log("🦊 Hello! @PingCAP website");

import './utils/jquery.SimpleTree.js'

/* Global Events */
$(function () {
    // form submit
    $('#submit').on('click', function () {
        var email = $('#email_to').val(),
            reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        //邮箱验证
        if (!!email && reg.test(email)) {
            console.log(email)
            $('#email_to').val('Thank You!');
        }
        return false;
    });

    // toggle wechat qr code
    $('#wechat').hover(function () {
        var qr_node = $('#js_qr_code');
        qr_node.toggleClass('f-hide');
    });

    //scoll - fixed header
    $(document).scroll(function(){
        $('#header').addClass('fixed-top');
        if($(document).scrollTop() == 0 )
            $('#header').removeClass('fixed-top');
    });
});

/* tree view related */
$(function () {
    $(".st_tree").SimpleTree({
        /* 可无视代码部分*/
        click: function (a) {
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


    var oFixed = $('#draw_fixed');
    var doFixed = function () {
        var t = $(document).scrollTop(), opacityValue = 1 - .00175 * t;

        oFixed.css({
            opacity: opacityValue
        })
    }
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
            return
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

/* pregressive image loading */
$(function () {
    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
    // get all the image containers from page

    var containers = $('.figure');

    // add class to corresponding element
    var setStyle = function setStyle(elem, className) {
        if (elem.classList) {
            elem.classList.add(className);
        } else {
            elem.className += ' ' + className;
        }
    };

    // main function to blur images
    var blurImg = function blurImg() {
        containers = [].concat(_toConsumableArray(containers));

        if (containers.length === 0) {
            // throw new Error('You have\'t add any photo!');
            console.log ('No Photo.');
            return;
        }
        containers.forEach(function (elem, index) {
            var thumbSrc = $(elem).attr('data-src') || 'https://download.pingcap.com/images/placeholder.jpg', //thumbnail
                lgSrc = $(elem).attr('src') || $(elem).find('img').attr('src'),
                realWidth = $(elem).attr('data-real-width') || 750,
                realHeight = $(elem).attr('data-real-height') || 355;

            // set a bottom padding to avoid glimmer
            elem.style.paddingBottom = realHeight / realWidth * 100 + '%';

            var thumb = new Image();
            thumb.src = thumbSrc;
            thumb.onload = function () {
                setStyle(thumb, 'thumb-loaded');
            };
            elem.appendChild(thumb);

            var realImg = new Image();
            realImg.src = lgSrc;
            realImg.onload = function () {
                setStyle(realImg, 'large-loaded');
                setStyle(thumb, 'thumb-hidden');
            };
            elem.appendChild(realImg);
        });
    };

    blurImg();

});
