// JS Goes here - ES6 supported

// Document Pages

import './vendor/jquery.SimpleTree.js'
import { run as toc_run } from './vendor/toc'

// Open the first folder
function openFolder(li) {
  if (li.hasClass('has-child')) {
    li.addClass('open')
    const $firstUL = li.find('ul')[0]
    const $LI = $($firstUL)
      .attr('style', 'display: block;')
      .find('li:first-child')
    return openFolder($LI)
  }
  li.addClass('active')
  return false
}

// Process Sticky Tree
function processStickyTree() {
  // Sticky tree show
  $('.st_tree').show()
  // Handle click events
  $('.st_tree').SimpleTree({
    click: a => {
      if ($(a).attr('href') != '#') {
        $(a)
          .parent()
          .parent()
          .find('.active')
          .removeClass('active')
        $(a)
          .parent()
          .addClass('active')
        window.location.href = $(a).attr('href')
      }
    },
  })

  // Open the first item in docs/docs-cn/weekly/recruit-cn list page
  const $firstLI = $('#list_page .st_tree > ul > li:first-child')
  const hash = decodeURIComponent(location.hash)
  if (!hash && $firstLI.length) openFolder($firstLI)
}

// Process tags
function processTags() {
  const hash = decodeURIComponent(location.hash)
  const pageType = $('.nav-tags').data('type')

  if (!hash) $('.tag.all').addClass('sel')

  if (pageType === 'list' && hash) {
    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${hash.slice(1)}"]`).addClass('sel')
    $('.article-list .article').each(function() {
      const $this = $(this)
      if ($this.data('tag').includes(hash.slice(1))) {
        $this.show()
      } else {
        $this.hide()
      }
    })
  }
}

// Replace the relative href in markdown-body
// function replaceHref(a) {
//   var href = $(a).attr('href')
//   var absUrlExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
//     mdSuffixExp = /\.md/

//   var absUrlRegex = new RegExp(absUrlExp),
//     mdSuffixRegex = new RegExp(mdSuffixExp)

//   if (!href.match(absUrlRegex) && href.match(mdSuffixRegex)) {
//     var newHref = '../' + href.replace(/\.md/, '')
//     $(a).attr('href', newHref)
//   }
// }

// Process links in markdown content
// function processLinksInMarkdown() {
//   $('.markdown-body')
//     .find('a')
//     .each(function() {
//       var $this = $(this)
//       // click event
//       $this.click(function(e) {
//         replaceHref(this)
//       })
//       // right click event for open in new window or copy link url
//       $this.contextmenu(function(e) {
//         replaceHref(this)
//       })
//     })
// }

// Process dom elements after loaded
$(document).ready(function() {
  if ($('.st_tree').length) processStickyTree()

  if ($('.nav-tags').length) processTags()

  // Create TOC for article in docs module
  if ($('.article-toc').length) toc_run()

  // processLinksInMarkdown()

  // process image: lazy load and add fade in effect
  $('.lazy').lazyload({
    threshold: 200,
    effect: 'fadeIn',
  })

  // Handle tags click: Filter tags on frontend
  $('.nav-tags .tag, .anchor-tag').click(function(e) {
    const $this = $(this)
    const isInlineTag = $this.hasClass('anchor-tag')
    const isAll = $this.hasClass('all')
    const filter = isInlineTag ? $this.text().trim() : $this.data('tag')

    $('.nav-tags .tag').removeClass('sel')
    $(`.nav-tags .tag[data-tag="${filter}"]`).addClass('sel')
    isAll && $('.tag.all').addClass('sel')

    const pageType = $('.nav-tags').data('type')

    if (pageType && pageType === 'single') {
      if (isAll) window.location.href = '../'
      else window.location.href = `../#${encodeURIComponent(filter)}`
    } else {
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
      if (isAll) window.location.href = `./`
      else window.location.href = `./#${encodeURIComponent(filter)}`
    }

    e.preventDefault()
    return false
  })
})
