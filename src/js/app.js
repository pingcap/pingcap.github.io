import { format } from "util"

import { dynamicAddSubscribeForm } from './mailchimp'
// JS Goes here - ES6 supported

// Global JS

// Say hello
console.log('🦊 Hello! @PingCAP website')
// const _ = require('lodash')

// import '../../dist/css/main.css'

// Smooth scrolling when the document is loaded and ready
function smoothScroll(hash) {
  const y = $('header').height()
  const marginTop = parseInt($(hash).css('marginTop'))
  if (hash && $(hash).offset())
    $('html, body').animate(
      {
        scrollTop: $(hash).offset().top - y - marginTop,
      },
      1000
    )
}

// Process hash
function processHash() {
  const hash = decodeURIComponent(location.hash)
  if (!hash) return
  if ($('.nav-tags').length && $('.nav-tags').data('type') === 'list') return

  if (location.href.search('#access_token') < 0) {
    smoothScroll(hash)
  }

  if ($('.tabs'.length)) {
    tabCheckedInDocs()
  }
}

// initial algolia search
function initialSearch(lang) {
  let urlParams = new URLSearchParams(window.location.search)
  let url = window.location.href

  var re = new RegExp('(v\\d+\\.\\d+|dev|stable)')
  var version
  var newHitArray = []

  // gets current version
  if (url.match(re)) {
    version = url.match(re)[0]
  }


  if (urlParams.has('q')) {
    $('#search-input').val(urlParams.get('q'))
    const client = algoliasearch(
      'F9LNQGQBWG',
      '53f6829641294d401e37fb6aacda703c'
    )
    // const client = algoliasearch('BH4D9OD16A', 'ad5e63b76a221558bdc65ab1abbec7a2');
    const index = client.initIndex('pingcap')

    index.search(
      {
        query: urlParams.get('q'),
        hitsPerPage: 300,
        facetFilters: ['tags:' + lang, 'version:' + version],
      },

      (err, { hits } = {}) => {
        if (err) throw err
        var categoryArr = []

        // selects the first result of each category and puts into the new hit array
        newHitArray = hits.filter(hit => {
          var category = hit.hierarchy.lvl0
          if (category && !categoryArr.includes(category)) {
            categoryArr.push(category)

            // unifies anchor style
            var lastLvl = Object.values(hit.hierarchy)
              .filter(value => value != null)
              .pop()
            hit['url'] = hit.url.replace(
              /\#.*$/g,
              '#' +
                lastLvl
                  .replace(/\s+/g, '-')
                  .replace(/[^-\w\u4E00-\u9FFF]*/g, '')
                  .toLowerCase()
            )
            return hit
          }
        })

        // appends results to search-results container
        if (newHitArray.length == 0) {
          if (lang == 'cn') {
            $('#search-result-title').append('搜索结果')
            $('#search-results').append(
              '<div class="search-category-result">\
                <p>很抱歉，我们没有找到您期望的内容。</p>\
                <ul>\
                <li>请尝试其它搜索词，或者去 <a href="https://asktug.com/" target="_blank"> AskTUG</a> (TiDB User Group) 提问试试。</li>\
                <li>如果您想搜索英文内容，请移步至<a href="https://pingcap.com/docs/">英文文档</a>进行搜索。</li>\
                </ul>\
              </div>'
            )
          } else if (lang == 'en') {
            $('#search-result-title').append('Search Results')
            $('#search-results').append(
              '<div class="search-category-result">\
                <p>Sorry. We couldn\'t find what you\'re looking for.</p>\
                <ul>\
                <li>If you\'ve come to pages of an unexpected language, go to <a href="https://pingcap.com/docs-cn/">Chinese documentation</a> and try again.</li>\
                <li>If you do want to get some English content, <a href="https://pingcap.com/">PingCAP home page</a> might be a better place for you to go.</li>\
                </ul>\
              </div>'
            )
          }
        } else {
          $('#search-result-title').append(
            lang == 'en' ? 'Search Results' : '搜索结果'
          )
          $('#search-results').append(
            newHitArray
              .map(
                hit =>
                  '<div class="search-category-result">\
              <a href="' +
                  hit.url +
                  '" target="_blank"><h1 class="search-category-title">' +
                  hit.hierarchy.lvl0 +
                  '</h1></a>' +
                  '<div class="item-link">' +
                  hit.url +
                  '</div>\
                <div class="search-result-item">' +
                  (hit._highlightResult.content.value.length > 500
                    ? hit._snippetResult.content.value
                    : hit._highlightResult.content.value) +
                  '</div>' +
                  '</div>'
              )
              .join('')
          )
        }

        // hides loader spinner when shows the search-results
        if ($('.search-category-result').length) {
          $('.lazy').css('display', 'none')
        }
      }
    )
  } else {
    if (lang == 'cn') {
      $('#search-result-title').append('搜索结果')
    } else if (lang == 'en') {
      $('#search-result-title').append('Search Results')
    }
    $('#search-results').append(
      '<div class="search-category-result">\
      </div>'
    )

    // hides loader spinner when shows the search-results
    if ($('.search-category-result').length) {
      $('.lazy').css('display', 'none')
    }
  }
}

// process search ui
function processSearch() {
  initialSearch($('#search-input').data('lang'))
  // Hide search suggestions dropdown menu on focusout
  $('#search-input').focusout(function() {
    $('.ds-dropdown-menu').hide()
  })
  // Show search suggestions dropdown menu on change
  $('#search-input').change(function(e) {
    e.preventDefault()
    if (e.target && e.target.value) $('.ds-dropdown-menu').show()
  })
}

// Process release banner
function processReleaseBanner() {
  var version = $('.release-banner').data('release')

  if (typeof Storage !== 'undefined') {
    // Code for localStorage/sessionStorage.
    var releaseVerInStorage = localStorage.getItem(`release-version-${version}`)
    if (!releaseVerInStorage) $('.homepage').addClass('banner-active')
  } else {
    // Sorry! No Web Storage support..
    $('.homepage').addClass('banner-active')
  }

  $('.release-banner__close').click(function(e) {
    if ($('body.banner-active')) $('body').removeClass('banner-active')
    // set localStorage to record release banner version
    if (typeof Storage !== 'undefined') {
      var version = $('.release-banner').data('release')
      localStorage.setItem(`release-version-${version}`, version)
    }
    e.preventDefault()
  })
}

// Toggle weChat qr code
function toggleWeChatQRCode() {
  $('#wechat').click(e => {
    e.preventDefault()
    $('#wechat .qr_code_outer').toggleClass('f-hide')
  })
  $('#wechat-mobile').on('touchstart', e => {
    e.preventDefault()
    $('#wechat-mobile .qr_code_outer').toggleClass('f-hide')
  })

  $('.tidb-planet-robot, .contact-us-hack19').click(e => {
    e.preventDefault()
    $('.qr-tooltiptext').toggleClass('f-hide')
  })
  $('.tidb-planet-robot').on('touchstart', e => {
    e.preventDefault()
    $('.qr-tooltiptext').toggleClass('f-hide')
  })
}

function handleWindowScroll() {
  var scrollVal = $(this).scrollTop(),
    y = $('header').height()
  var amountScrolled = 200

  //process release banner in homepage
  if ($('body.banner-active') && scrollVal >= y) {
    $('body.banner-active').addClass('banner-active--scrolled')
  }
  if ($('body.banner-active--scrolled') && scrollVal < y) {
    $('body').removeClass('banner-active--scrolled')
  }
  // process back to top button
  if (scrollVal > amountScrolled) {
    $('.back-to-top').addClass('show')
  } else {
    $('.back-to-top').removeClass('show')
  }
}

function processMobileOverlay() {
  $('.nav-btn.nav-slider').click(function() {
    $('.overlay').show()
    $('nav').toggleClass('open')
  })
  $('.overlay').click(function() {
    if ($('nav').hasClass('open')) {
      $('nav').removeClass('open')
    }
    $(this).hide()
  })
}

function tabCheckedInDocs() {
  const hash = decodeURIComponent(location.hash)
  var contentTabID
  if (hash) {
    switch (hash) {
      case '#google':
        $('input:radio[name=tabs]')
          .filter('[value=GoogleContent]')
          .prop('checked', true)
        break
      case '#aws':
        $('input:radio[name=tabs]')
          .filter('[value=AWSContent]')
          .prop('checked', true)
        break
      case '#local':
        $('input:radio[name=tabs]')
          .filter('[value=LocalContent]')
          .prop('checked', true)
        break
      case '#production':
        $('input:radio[name=tabs]')
          .filter('[value=productionContent]')
          .prop('checked', true)
        break
      case '#development':
        $('input:radio[name=tabs]')
          .filter('[value=developmentContent]')
          .prop('checked', true)
        break
    }
  } else {
    contentTabID = $('input:checked').val()
    switch (contentTabID) {
      case 'GoogleContent':
        window.location.href = `./#google`
        break
      case 'AWSContent':
        window.location.href = `./#aws`
        break
      case 'LocalContent':
        window.location.href = `./#local`
        break
      case 'productionContent':
        window.location.href = `./#production`
        break
      case 'developmentContent':
        window.location.href = `./#development`
        break
    }
  }
  contentTabID = $('input:checked').val()
  $('section').hide()
  $('#' + contentTabID).show()
  $('input').on('click', function() {
    contentTabID = $('input:checked').val()
    switch (contentTabID) {
      case 'GoogleContent':
        window.location.href = `./#google`
        break
      case 'AWSContent':
        window.location.href = `./#aws`
        break
      case 'LocalContent':
        window.location.href = `./#local`
        break
      case 'productionContent':
        window.location.href = `./#production`
        break
      case 'developmentContent':
        window.location.href = `./#development`
        break
    }
    $('section').hide()
    $('#' + contentTabID).show()
  })
}

// get TiDB contributors count
function getTidbContributorCount() {
  const url = 'https://pingcap.com/api/tidb-contributors'
  var count
  var countArr = []
  $.ajax({
    url,
    crossDomain: true,
    success: function(res) {
      window.tidbContributors = res.data
      if (res.data) {
        count = res.data.length
        const countLen = count.toString().length
        let s, q
        for (let i = countLen; i > 0; i--) {
          s = parseInt(count / Math.pow(10, i - 1))
          count = count % Math.pow(10, i - 1)
          countArr.push(s)
        }

        $('#tidb-contributor-count').append(
          countArr.map(
            c =>
              '<div class="numb">\
                <p>' +
              c +
              '</p>\
              </div>'
          )
        )
      }
    },
  })
}

$(document).ready(function() {
  processHash()

  if ($('body').data('lang') === 'cn') dynamicAddSubscribeForm()

  getTidbContributorCount()

  // Handle hash change
  $(window).on('hashchange', processHash)

  // Handle window scroll event
  $(window).scroll(handleWindowScroll)

  if ($('.homepage').length) processReleaseBanner()

  processSearch()

  toggleWeChatQRCode()

  processMobileOverlay()

  if ($('.tabs').length) tabCheckedInDocs()

  // Handle click event on Back to top button
  $('.back-to-top').click(function() {
    $('html, body').animate(
      {
        scrollTop: 0,
      },
      800
    )
    return false
  })
})
