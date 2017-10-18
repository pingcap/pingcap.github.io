/**
 * Created by leixuechun on 2017/2/21.
 */
/*! functions.js */
// var $ = require('jquery');

$(function () {
  //Generally use local variables to save window.location.pathname avoid multiple JS nested property query time-consuming
  var pathname =　window.location.pathname.split('/').pop(),
    hash = window.location.hash,
    path;

  $.fn.extend({
    SimpleTree: function (options) {

      var option = $.extend({
        click: function (a) {
        }
      }, options);

      option.tree = this;

      option._init = function () {

        this.tree.find("ul ul").hide();
        this.tree.find("ul ul").prev("li").removeClass("open");

        // FIXME: highlight selected item

        this.tree.find("li").each(function () {
          switch (pathname) {
          case 'docs':
            hash = hash ? hash: '#tidb-introduction';
            path = 'doc-overview.html' + hash;
            break;
          case 'docs-cn':
            hash = hash ? hash: '#tidb-简介';
            path = 'doc-overview-zh.html' + hash;
            break;
          default:
            path = pathname.indexOf('.html')>=0 ? pathname + hash : pathname +'.html' + hash;
          }
          //remove the '/' in head of path
          if(path[0] == '/') path = path.slice(1);
          if(path[path.length-1] == '#') path = path.slice(0, -1);
          var href = $(this).find("a").attr('href');
          if(href[0] == '/') href = href.slice(1);

          if (href === decodeURIComponent(path)) {
            $(this).parents("ul").attr('show', true);
            $(this).addClass("active");
          }
        });

        this.tree.find("ul ul[show='true']").show();
        this.tree.find("ul ul[show='true']").prev("li").addClass("open");
      };
      /* option._init() End */

      this.find("a").click(function () {
        $(this).parent("li").click();
        return false;
      });


      this.find("li").click(function () {


        option.click($(this).find("a")[0]);

        if ($(this).next("ul").attr("show") == "true") {
          $(this).next("ul").attr("show", "false");
        } else {
          $(this).next("ul").attr("show", "true");
        }

        option._init();
      });

      this.find("ul").prev("li").addClass("folder");

      this.find("li").find("a").attr("hasChild", false);
      this.find("ul").prev("li").find("a").attr("hasChild", true);

      option._init();

    }/* tree Function End */

  });
});
