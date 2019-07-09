/**
 * Created by leixuechun on 2017/2/21.
 */
/*! functions.js */
// var $ = require('jquery');

$(function() {
  //Generally use local variables to save window.location.pathname avoid multiple JS nested property query time-consuming

  $.fn.extend({
    SimpleTree: function(options) {
      var option = $.extend(
        {
          click: function(a) {},
        },
        options
      )

      option.tree = this

      option._init = function() {
        this.tree.find('.has-child ul').hide()

        // Hack to match url
        this.tree.find('li').each(function() {
          var href = $(this)
            .find('a')
            .attr('href')
          var pathname = window.location.pathname,
            hash = window.location.hash

          // some hrefs have '#', some don't have one.
          // find the macthed article
          if (
            decodeURIComponent(href.toLocaleLowerCase()) ===
              decodeURIComponent((pathname + hash).toLocaleLowerCase()) ||
            decodeURIComponent(href.toLocaleLowerCase()) ===
              decodeURIComponent(pathname.toLocaleLowerCase())
          ) {
            var $i = $(this),
              $p
            while ($i.is('li')) {
              $p = $i.parent()
              if ($p.is('ul')) {
                $p.show()
              }
              $i = $p.parent()
              $i.addClass('open')
            }
            $(this).addClass('active')
          }
        })
        this.tree.show()
      }

      this.find('li').click(function(e) {
        const $this = $(this)
        option.click($this.find('a')[0])
        $this.toggleClass('open')

        const $ul = $this.children('ul')
        if ($ul.is(':visible')) {
          $ul.hide()
        } else {
          $ul.show()
        }

        e.preventDefault()
        return false
      })

      this.find('.has-child').addClass('folder')

      option._init()
    } /* tree Function End */,
  })
})
