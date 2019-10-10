import { format } from "util"

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
function initialSearch(lang, stableVersion) {
  let urlParams = new URLSearchParams(window.location.search)
  let url = window.location.href
  
  var re = new RegExp("(v\\d+\\.\\d+|dev)")
  var version

  // gets current version
  if (url.match(re)) {
    version = url.match(re)[0]
  }

  
  if (urlParams.has('q')) {
    $('#search-input').val(urlParams.get('q'))
    const client = algoliasearch('BH4D9OD16A', 'ad5e63b76a221558bdc65ab1abbec7a2');
    const index = client.initIndex('pingcap');

    index.search(
      {
        query: urlParams.get('q'),
        hitsPerPage: 50,
        facetFilters: ['tags:' + lang, 'version:' + version],
      },

      (err, {hits} = {}) => {
        if(err) throw err;

      var highlightContent = []

      console.log('hits ', hits)

      hits.forEach((hit, idx) => {
        // gets highlight snippet
        if(hit._highlightResult && hit._highlightResult.content && hit._highlightResult.content.value.length < 500) {
          highlightContent[idx] = hit._highlightResult.content.value
        } else if(hit._snippetResult && hit._snippetResult.content) {
          highlightContent[idx] = hit._snippetResult.content.value
        } else {
          highlightContent[idx] = ''
        }
        
        // unifies anchor style
        var preKey
        for (var key in hit.hierarchy) {
          if(idx == 6 && hit.hierarchy[key] != null) {
            let newAnchor = hit.hierarchy[key].replace(/\s+/g, '-').replace(/[^-\w\u4E00-\u9FFF]*/g, '').toLowerCase()
            hits[idx].anchor = newAnchor
            hits[idx].url = hits[idx].url.replace(/\#.*$/g, '#' + newAnchor)
          } else if(hit.hierarchy[key] == null && hit.hierarchy[preKey] != null) {
            let newAnchor = hit.hierarchy[preKey].replace(/\s+/g, '-').replace(/[^-\w\u4E00-\u9FFF]*/g, '').toLowerCase()
            hits[idx].anchor = newAnchor
            hits[idx].url = hits[idx].url.replace(/\#.*$/g, '#' + newAnchor)
            break
          }
          preKey = key
        }
      })


      // formates returned hits
      let formattedHits = docsearch.formatHits(hits);
      let previousResult = null;
      let collatedResults = [];

      formattedHits.forEach((hit, idx) => {
        if(highlightContent[idx]) {
          hit.text = highlightContent[idx]
        }
      })

      // collects hits by lvl0
      formattedHits.forEach((hit, idx) => {
        if (!hit.category || !hit.title) return;
        if (!previousResult || previousResult.category !== hit.category) {
          previousResult = {
            category: hit.category,
            hits: [],
            url: hit.url
          };
          collatedResults.push(previousResult);
        }

        // assigns content to hit text
        if(!hit.text) {
          hit.text = hit.title
        }

        const previousHit = previousResult.hits[previousResult.hits.length - 1];
          if (!previousHit || previousHit.text !== hit.text) {
            previousResult.hits.push(hit);
          }
      });

      console.log('formatted: ', formattedHits)

      // appends results to search-results container
      $('#search-results').append(collatedResults.map(result => (
        '<div class="search-category-result">\
          <h1 class="search-category-title">' + result.category + '</h1>' +
          result.hits.map(hit => (
            '<div class="search-result-item">' + 
            (hit.subcategory != hit.text ? '<span class="subcategory">' + hit.subcategory +  ' > </span>' : '') +
              '<span class="text">' +  hit.text + '<a class="item-header" href="' + hit.url + '"> [Read More&hellip;]</a></span>\
            </div>'
          )).join('') +
        '</div>'
      )).join(''));

      // hides loader spinner when shows the search-results
      if($('.search-category-result').length) {
        $('.lazy').css('display', 'none')
      }
    });
  }
}

// process search ui
function processSearch() {
  initialSearch($('#search-input').data('lang'), $('#search-input').data('stable-version'))
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

$(document).ready(function() {
  processHash()

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
