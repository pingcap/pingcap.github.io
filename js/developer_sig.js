!function(r){var n={};function o(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return r[e].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=r,o.c=n,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)o.d(r,n,function(e){return t[e]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/js/",o(o.s=12)}({12:function(e,t){function r(o){var e="https://bots.tidb.io/ti-community-bot/sigs/"+o;$.getJSON(e,function(e){var t,r,n=e.data.membership;e&&($(".loader-spinner").css("display","none"),$(".developer-sig").css("background-color","#F5F6F8")),t=o,r=n,$('<div class="member-header" id="member-'+t+'">'+t+" SIG </div>").appendTo(".developer-group-members"),Object.keys(r).forEach(function(e){return $('<div class="member-list">        <div class="member-type">'+e+'</div>        <div class="flex-lists members divider" id="member-'+e+'"></div>      </div>').appendTo(".developer-group-members")}),Object.keys(r).forEach(function(t){return r[t].forEach(function(e){return $('<a class="member flex-lists member-hover" href="https://github.com/'+e.githubName+'" target="_blank">            <img class="lazy avatar" src="https://github.com/'+e.githubName+'.png" alt="avatar" />            <div class="member-info">              <div class="github-icon"><p>'+e.githubName+"</p></div>            </div>        </a>").appendTo("#member-"+t)})})})}$(document).ready(function(){var e=window.location.pathname.split("/");r(e.pop()||e.pop())})}});