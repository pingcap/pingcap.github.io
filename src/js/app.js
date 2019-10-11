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

      // var highlightContent = []

      console.log('hits: ', hits)

      var newFormattedHits = hits.map(hit => {
        var newHitArray = {}
        if(hit.hierarchy.lvl0) {
          newHitArray['category'] = hit.hierarchy.lvl0
        }

        if(hit._highlightResult.hierarchy) {
          // var subTitles = Object.keys(hit._highlightResult.hierarchy).map(lvl => {
          //   return hit._highlightResult.hierarchy[lvl].value
          // }).join(' > ');

          // newHitArray['subTitles'] = subTitles

          var lvls = Object.keys(hit._highlightResult.hierarchy)
          var lvl0 = lvls.shift()
          let subTitles
          console.log('keys: ',lvls, lvl0)
          if(lvls.length > 0) {
            subTitles = lvls.map(lvl => {
              return hit._highlightResult.hierarchy[lvl].value
            }).join(' > ');
          } else {
            subTitles = hit._highlightResult.hierarchy[lvl0].value
          }
          newHitArray['subTitles'] = subTitles
        }

        if(hit.content) {
          if(hit.content.length < 500) {
            newHitArray['textContent'] = hit._highlightResult.content.value
          } else {
            newHitArray['textContent'] = hit._snippetResult.content.value
          }
        } else if(!hit.content) {
          newHitArray['textContent'] = null
        }

        // unifies anchor style
        var lastLvl = Object.values(hit.hierarchy).filter(value => value != null).pop()
        newHitArray['url'] = hit.url.replace(/\#.*$/g, '#' + lastLvl.replace(/\s+/g, '-').replace(/[^-\w\u4E00-\u9FFF]*/g, '').toLowerCase())

        return newHitArray
      })

      console.log('newFormattedHits', newFormattedHits)

      // console.log('newformatedhits: ', newFormattedHits)
      // let formattedHits = docsearch.formatHits(hits);

      // console.log('formatted: ', formattedHits)

      // hits.forEach((hit, idx) => {
      //   // gets highlight snippet
      //   if(hit._highlightResult && hit._highlightResult.content && hit._highlightResult.content.value.length < 500) {
      //     highlightContent[idx] = hit._highlightResult.content.value
      //   } else if(hit._snippetResult && hit._snippetResult.content) {
      //     highlightContent[idx] = hit._snippetResult.content.value
      //   } else {
      //     highlightContent[idx] = ''
      //   }
        
        
      // })

      // formates returned hits
      let previousCategories = []
      let resultsInCategory = []
      let collatedResults = [];


      // formattedHits.forEach((hit, idx) => {
      //   if(highlightContent[idx]) {
      //     hit.text = highlightContent[idx]
      //   }
      // })

      // collects hits by lvl0
      newFormattedHits.forEach(hit => {
        console.log('hit', hit.category, previousCategories, previousCategories.includes(hit.category), collatedResults)
        if(!hit.category) return;
        if(previousCategories && previousCategories.includes(hit.category)) {
          collatedResults.forEach((res, i) => {
            if(res.category == hit.category) {
              collatedResults[i].hits.push(hit)
            }
          })
        } else {
          previousCategories.push(hit.category)
          resultsInCategory = {
            category: hit.category,
            hits:[hit],
          }
          collatedResults.push(resultsInCategory)
        }
        // console.log('previous', previousCategories, collatedResults)
        // if (!previousResult || previousResult.category !== hit.category) {
        //   previousResult = {
        //     category: hit.category,
        //     hits: [],
        //     url: hit.url
        //   };
        //   collatedResults.push(previousResult);
        // }

        // assigns content to hit text
        // if(!hit.textContent) {
        //   hit.text = hit.title
        // }

        // const previousHit = previousResult.hits[previousResult.hits.length - 1];

        // if(!previousHit) {
        //   previousResult.hits.push(hit);
        // }

        // if (hit.text.indexOf('class="algolia-docsearch-suggestion--highlight"') < 0 && hit.subcategory.indexOf('class="algolia-docsearch-suggestion--highlight"') < 0) {
        //   return
        // } else if (!previousHit || previousHit.text !== hit.text) {
        //   previousResult.hits.push(hit);
        // }
      });

      // enum duplicate anchors in an docs/docs-cn
      var idsMap = new Map()
      collatedResults.forEach(result => {
        result.hits.forEach(hit => {
          if(idsMap.has(hit.url)) {
            const number = idsMap.get(hit.url)
            idsMap.set(hit.url, number + 1)
            hit.url = `${hit.url}-${number + 1}`
          } else {
            idsMap.set(hit.url, 0)
            hit.url = `${hit.url}`
          }
        })
      })

      console.log('collected: ', collatedResults)

      // appends results to search-results container
      if(collatedResults.length == 0) {
        $('#search-results').append(
          '<div class="search-category-result"> Oops... No Result!</div>'
        );
      } else {
        $('#search-results').append(collatedResults.map(result => (
          '<div class="search-category-result">\
            <h1 class="search-category-title">' + result.category + '</h1>' +
            result.hits.map(hit => (
              '<div class="search-result-item">\
                <span class="subcategory">' + hit.subTitles + 
                (hit.textContent ? '</span><span class="text"> > ' +  hit.textContent + '<a class="item-header" href="' + hit.url + '"> [Read More&hellip;]</a></span>' : '<a class="item-header" href="' + hit.url + '"> [Read More&hellip;]</a></span>') +
              '</div>'
            )).join('') +
          '</div>'
        )).join(''));
      }

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
