!function(s){var i={};function n(e){if(i[e])return i[e].exports;var t=i[e]={i:e,l:!1,exports:{}};return s[e].call(t.exports,t,t.exports,n),t.l=!0,t.exports}n.m=s,n.c=i,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(s,i,function(e){return t[e]}.bind(null,i));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/js/",n(n.s=10)}({10:function(e,t){function d(){var e=$(this).scrollTop(),t=$("header").height();0<e&&0!=$(".devcon-nav").length?($("header").hide(),$(".devcon-nav").css("top","0"),$(".devCon").css("padding-top",t)):0!=$(".devcon-nav").length&&($("header").show(),$(".devcon-nav").css("top",t),$(".devCon").css("padding-top",2*t))}function a(){var e;switch($(this)[0].className){case"schedule-btn":e=".agenda__section h1";break;case"instructor-btn":e=".instructors__section h1";break;case"contact-btn":e=".contact__section h1";break;case"signup-btn":e=".signup__section"}var t=0;t=$("header").length&&!$("header").is(":hidden")&&0!=$(".devcon-nav").length?2*$("header").height():$("header").height(),$("html, body").animate({scrollTop:$(e).offset().top-t},1e3)}function c(){var e=$("header").height();$("header").length&&!$("header").is(":hidden")&&0!=$(".devcon-nav").length?($(".devcon-nav").css("top",e),$(".devcon-nav").css("height",e),$(".devCon").css("padding-top",2*e)):($(".devcon-nav").css("top",0),$(".devcon-nav").css("height",e));var t=$(".architecture img").width();if(window.matchMedia("(max-width: 360px)").matches)var s=.47*t,i=.11;else if(window.matchMedia("(max-width: 700px)").matches)s=.51*t,i=.11;else s=t/3.17,i=.18;var n=parseInt($(".architecture").css("padding-right")),d=parseInt($(".architecture").css("padding-left")),a=parseInt($(".architecture").css("padding-top"));parseInt($(".architecture").css("padding-bottom"));$(".head-node").css("top",a-$(".head-node").height()-2*parseInt($(".head-node").css("padding-top"))),$(".head-node").css("margin-left",-($(".head-node").width()+2*parseInt($(".head-node").css("padding-left")))/2),$(".developer-group").css("top",s*i*2+a),$(".developer-group").css("margin-left",-($(".developer-group").width()+2*parseInt($(".developer-group").css("padding-left")))/2),$(".pmc").css("top",s*i*2+a),$(".pmc").css("left",d-($(".pmc").width()+parseInt($(".pmc").css("padding-left"))+parseInt($(".pmc").css("padding-right")))/2),$(".committee").css("top",s*i*2+a),$(".committee").css("margin-right",n-($(".committee").width()+parseInt($(".committee").css("padding-left"))+parseInt($(".committee").css("padding-right")))/2),$(".maintainer").css("top",a+s),$(".maintainer").css("margin-left",d-($(".maintainer").width()+parseInt($(".maintainer").css("padding-left"))+parseInt($(".maintainer").css("padding-right")))/2),$(".committer").css("top",a+s),$(".committer").css("margin-left",d+t/3-($(".committer").width()+parseInt($(".committer").css("padding-left"))+parseInt($(".committer").css("padding-right")))/2),$(".contributor").css("top",a+s),$(".contributor").css("margin-right",n+t/3-($(".contributor").width()+parseInt($(".contributor").css("padding-left"))+parseInt($(".contributor").css("padding-right")))/2),$(".member").css("top",a+s),$(".member").css("margin-right",n-($(".member").width()+parseInt($(".member").css("padding-left"))+parseInt($(".member").css("padding-right")))/2)}function o(){"block"==$(".guide-content").css("display")&&($(".subtitle-guide").removeClass("subtitle-selected-bg"),$(".guide-content").hide(),$("#guide-collapse")[0].innerText="+"),"block"==$(".pr-content").css("display")?($(".subtitle-pr").removeClass("subtitle-selected-bg"),$(".pr-content").hide(),$("#pr-collapse")[0].innerText="+"):($(".subtitle-pr").addClass("subtitle-selected-bg"),$(".pr-content").show(),$("#pr-collapse")[0].innerText="-")}function r(){"block"==$(".pr-content").css("display")&&($(".subtitle-pr").removeClass("subtitle-selected-bg"),$(".pr-content").hide(),$("#pr-collapse")[0].innerText="+"),"block"==$(".guide-content").css("display")?($(".subtitle-guide").removeClass("subtitle-selected-bg"),$(".guide-content").hide(),$("#guide-collapse")[0].innerText="+"):($(".subtitle-guide").addClass("subtitle-selected-bg"),$(".guide-content").show(),$("#guide-collapse")[0].innerText="-")}$(document).ready(function(){var e,t,s,i=decodeURIComponent(location.hash);if(t=window.matchMedia("(max-width: 500px)").matches?e=60:(e=250,60),i&&("#contributor"==i?$("html, body").animate({scrollTop:$(".contributor__detail").offset().top-e},1e3):"#committer"==i?$("html, body").animate({scrollTop:$(".committer__detail").offset().top-e},1e3):"#architecture"==i&&$("html, body").animate({scrollTop:$(".organization__section .section-title").offset().top-t},1e3)),$(".meetup-landing-page-banner").length&&$(".swiper-slide").each(function(){var e=$(this),t=e.find(".meetup-date")[0];new Date(t.innerText).setHours(0,0,0,0)-18e6<new Date&&"活动回顾"!==e.find(".meetup-register")[0].innerText&&(e.find("a")[0].removeAttribute("href"),e.find(".meetup-register").text("报名结束"),e.find(".meetup-register").addClass("unclickable-btn"))}),$("header").length&&0!=$(".devcon-nav").length){var n=$("header").height();$(".devcon-nav").css("top",n),$(".devcon-nav").css("height",n),$(".devCon").css("padding-top",2*n)}$(".detail-block").hide(),c(),$(window).scroll(d),$(window).resize(c),$(".schedule-btn").click(a),$(".instructor-btn").click(a),$(".contact-btn").click(a),$(".signup-btn").click(a),$(".instructor").click(function(){if(window.matchMedia("(max-width: 1024px)").matches){$(".intro").css("opacity","0");$(this).find(".intro").css("opacity","1")}}),$(".team").click(function(){if(window.matchMedia("(max-width: 1024px)").matches){$(".middle-overlay").css("opacity","0"),$(".middle-cover").css("opacity","1"),$(".award-info").css("opacity","1");$(this).find(".middle-overlay").css("opacity","1"),$(this).find(".middle-cover, .award-info").css("opacity",0)}}),$(".project").click(function(){if(window.matchMedia("(max-width: 1024px)").matches){$(".project-desc").css("opacity","0");$(this).find(".project-desc").css("opacity","1")}}),$(".section-burger").click(function(){"block"==$(".dropdown-btns").css("display")?$(".dropdown-btns").css("display","none"):$(".dropdown-btns").css("display","block")}),$(".agenda__table .collapsable").click(function(){window.matchMedia("(min-width: 550px)").matches&&(s&&(s.removeClass("selected-bg"),s.children()[3].innerText="+"),$(this).addClass("selected-bg"),"none"==$(this).next()[0].style.display?($(".detail-block").hide(),$(this).next().show(),$(this).children("td")[3].innerText="-"):($(this).next().hide(),$(this).removeClass("selected-bg"),$(this).children("td")[3].innerText="+"),s=$(this))}),$(".schedule-table .collapsable").click(function(){s&&(s.removeClass("selected-bg"),s.children()[3].innerText="+"),$(this).addClass("selected-bg"),"none"==$(this).next()[0].style.display?($(".detail-block").hide(),$(this).next().show(),$(this).children("td")[3].innerText="-"):($(this).next().hide(),$(this).removeClass("selected-bg"),$(this).children("td")[3].innerText="+"),s=$(this)}),$(".date").click(function(){switch($(".date").removeClass("is-active"),$(this).addClass("is-active"),$(this).hasClass("date1")){case!0:$(".day1").removeClass("hide-schedule"),$(".day2").addClass("hide-schedule"),$(".switch-date-btn").addClass("date2"),$(".switch-date-btn").removeClass("date1"),0<$(".devCon-cn").length?$(".switch-date-btn")[0].innerText="DAY2 日程":$(".switch-date-btn")[0].innerText="DAY2 Schedule";break;default:$(".day1").addClass("hide-schedule"),$(".day2").removeClass("hide-schedule"),$(".switch-date-btn").addClass("date1"),$(".switch-date-btn").removeClass("date2"),0<$(".devCon-cn").length?$(".switch-date-btn")[0].innerText="DAY1 日程":$(".switch-date-btn")[0].innerText="DAY1 Schedule"}}),$(".switch-date-btn").click(function(){switch($(".date").removeClass("is-active"),$("html, body").animate({scrollTop:$("#dc20-agenda-table").offset().top},1e3),$(this).hasClass("date1")){case!0:$(".date1").addClass("is-active"),$(".day1").removeClass("hide-schedule"),$(".day2").addClass("hide-schedule"),$(this).removeClass("date1"),$(this).addClass("date2"),0<$(".devCon-cn").length?$(this)[0].innerText="DAY2 日程":$(".switch-date-btn")[0].innerText="DAY2 Schedule";break;default:$(".date2").addClass("is-active"),$(".day1").addClass("hide-schedule"),$(".day2").removeClass("hide-schedule"),$(this).removeClass("date2"),$(this).addClass("date1"),0<$(".devCon-cn").length?$(this)[0].innerText="DAY1 日程":$(".switch-date-btn")[0].innerText="DAY1 Schedule"}}),$(".subtitle-pr").click(o),$(".subtitle-guide").click(r),$(".committer").click(function(){$("html, body").animate({scrollTop:$(".committer__detail").offset().top-80},1e3)}),$(".contributor").click(function(){$("html, body").animate({scrollTop:$(".contributor__detail").offset().top-70},1e3)})})}});