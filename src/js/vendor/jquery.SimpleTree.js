/**
 * Created by leixuechun on 2017/2/21.
 */
/*! functions.js */
// var $ = require('jquery');

$(function() {
  //Generally use local variables to save window.location.pathname avoid multiple JS nested property query time-consuming
  var pathname = window.location.pathname.split('/').pop(),
    hash = window.location.hash,
    path

  $.fn.extend({
    SimpleTree: function(options) {
      /*
      依赖于 DOM 结构：

      div.st_tree
        ul[show=true]
          li.folder.open
          ul[show=true].display:block

       */
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
          if (href === decodeURIComponent(window.location.pathname)) {
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
      }

      this.find('li').click(function(e) {
        const $this = $(this)
        option.click($this.find('a')[0])
        $this.toggleClass('open')
        const $ul = $this.find('ul')
        if ($ul.is(':visible')) {
          $ul.hide()
        } else {
          $ul.show()
        }

        e.preventDefault()
        return false
      })

      this.find('.has-child').addClass('folder')

      // this.find('li')
      //   .find('a')
      //   .attr('hasChild', false)
      // this.find('ul')
      //   .prev('li')
      //   .find('a')
      //   .attr('hasChild', true)

      option._init()
    } /* tree Function End */,
  })
})
