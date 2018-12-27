function handleWindowResize() {
  console.log('handling window resize...')
  var BW = $('.banner__container').width()
  console.log('bw is: ', BW, $('.banner__container').css('height', BW / 2.67))
  $('.banner__container').css('height', BW / 2.67)
}

function calcBannerTitleImg() {
  if (window.matchMedia('(max-width: 1100px)').matches) {
    $('.banner__section .banner').attr(
      'src',
      '/images/community/community-banner-mobile.jpg'
    )
    // var banner_H = $('.banner__section .banner').width() / 1.6
    // var TP = banner_H * 0.15 + 'px 0 0'
  } else {
    $('.banner__section .banner').attr(
      'src',
      '/images/community/community-banner-pc.jpg'
    )
    // var banner_H = $('.banner__section .banner').width() / 2.67
    // var TP = banner_H * 0.05 + 'px 0 0'
  }
  // console.log('width: ', $('.banner__section .banner').width())
  // console.log('height: ', banner_H)

  // // var TP = banner_H * 0.15 + 'px 0 0'
  // console.log('padding', TP)

  // document.getElementsByClassName('title-image')[0].style.padding = TP
}

function createEventListConsole(eventTitles, eventLinks) {
  $('.cld-days').hide()
  $('.cld-labels').hide()
  $('.event-list').show()
  for (let i = 0; i < eventTitles.length; i++) {
    var event = document.createElement('div')
    event.className = 'event'
    event.innerHTML =
      '<a href="' + eventLinks[i] + '">' + eventTitles[i] + '</a>'
    $('.event-list').append(event)
  }
}

$(document).ready(function() {
  var events = [
    {
      Date: new Date(2018, 12, 24),
      Title: ['Christmas Eve - Beijing'],
      Link: 'https://pingcap.com',
    },
    {
      Date: new Date(2018, 12, 22),
      Title: ['第 N 期 Meetup - 上海'],
      Link: 'https://pingcap.com/community/devcon2019',
    },
    {
      Date: new Date(2018, 12, 18),
      Title: 'New Garfield movie comes out!',
      Link: 'https://pingcap.com/community/devcon2019',
    },
    {
      Date: new Date(2018, 12, 18),
      Title: 'Happy New Year!',
      Link: 'https://pingcap.com/community/devcon2019',
    },
    {
      Date: new Date(2018, 12, 3),
      Title: '25 year anniversary',
      Link: 'https://www.google.com.au',
    },
  ]
  var settings = {
    test: 'testme',
  }
  var element = document.getElementById('calendar')
  calendar(element, events, settings)

  console.log('width: ', $(window).width())

  calcBannerTitleImg()
  $(window).resize(calcBannerTitleImg)
  // activity width
  // var activity_W = $(window).width()
  // if (window.matchMedia('(max-width: 1300px)').matches) {
  //   console.log('matched')
  //   $('.title-image').()
  // }
  // $('.activity').css('width', activity_W * 0.32)
  // $('.activity').css('height', activity_W * 0.37)

  // $('window').width()

  $('.eventday').click(function() {
    var el = $(this)
    var eventTitles = []
    var eventLinks = []
    for (let i = 1; i < el[0].childNodes.length; i++) {
      eventTitles.push(el[0].childNodes[i].innerText)
      eventLinks.push(el[0].childNodes[i].childNodes[0].href)
    }
    console.log('eventtitles: ', eventTitles)
    createEventListConsole(eventTitles, eventLinks)
  })

  $('.close-icon').click(function() {
    $('.cld-days').show()
    $('.cld-labels').show()
    $('.event-list').hide()
    $('.event').remove()
  })
})
