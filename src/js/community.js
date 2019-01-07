// function handleWindowResize() {
//   console.log('handling window resize...')
//   var BW = $('.banner__container').width()
//   console.log('bw is: ', BW, $('.banner__container').css('height', BW / 2.67))
//   $('.banner__container').css('height', BW / 2.67)
// }

function calcBannerTitleImg() {
  // change banner depending on the window size
  if (window.matchMedia('(max-width: 700px)').matches) {
    $('.banner__section .banner').attr(
      'src',
      '/images/community/community-banner-mobile.png'
    )

    $('.signable .picture img').attr(
      'src',
      '/images/community/activities/mobileDevCon.png'
    )

    $('.relationship').show()
  } else {
    $('.banner__section .banner').attr(
      'src',
      '/images/community/community-banner-pc.svg'
    )
    $('.signable .picture img').attr(
      'src',
      '/images/community/activities/PCdevCon.png'
    )
    $('.relationship').hide()
  }

  // calculate the margin of div activity container
  if (window.matchMedia('(min-width: 1351px)').matches) {
    var activity_container_margin =
      document.getElementsByClassName('signable')[0].offsetLeft - 100
  } else if (window.matchMedia('(min-width: 1250px)').matches) {
    var activity_container_margin =
      document.getElementsByClassName('signable')[0].offsetLeft - 50
  } else if (window.matchMedia('(min-width: 701px)').matches) {
    var activity_container_margin = document.getElementsByClassName(
      'signable'
    )[0].offsetLeft
  } else {
    var activity_container_margin = 0
  }

  $('.content__container .content').css(
    'margin-left',
    activity_container_margin
  )
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

// function setClndrHeight() {

// }

$(document).ready(function() {
  var events = [
    {
      Date: new Date(2019, 1, 24),
      Title: 'Christmas Eve - Beijing',
      Link: 'https://pingcap.com',
    },
    {
      Date: new Date(2019, 1, 2),
      Title: '第 N 期 Meetup - 上海',
      Link: 'https://pingcap.com/community/devcon2019',
    },
    {
      Date: new Date(2019, 1, 4),
      Title: '第 N 期 Meetup - 上海',
      Link: 'https://pingcap.com/community/devcon2019',
    },
    {
      Date: new Date(2019, 1, 4),
      Title: '第 N 期 Meetup - beijing',
      Link: 'https://pingcap.com/community/devcon2019',
    },
    {
      Date: new Date(2019, 1, 3),
      Title: '25 year anniversary',
      Link: 'https://www.google.com.au',
    },
  ]
  var settings = {
    test: 'testme',
  }

  var element = document.getElementById('calendar')
  calendar(element, events, settings)

  // setClndrHeight()
  calcBannerTitleImg()
  $(window).resize(calcBannerTitleImg)

  $('.eventday').click(function() {
    var el = $(this)
    var eventTitles = []
    var eventLinks = []
    for (let i = 1; i < el[0].childNodes.length; i++) {
      eventTitles.push(el[0].childNodes[i].innerText)
      eventLinks.push(el[0].childNodes[i].childNodes[0].href)
    }
    createEventListConsole(eventTitles, eventLinks)
  })

  $('.close-icon').click(function() {
    $('.cld-days').show()
    $('.cld-labels').show()
    $('.event-list').hide()
    $('.event').remove()
  })

  $('.signable').click(function() {
    if (window.matchMedia('(max-width: 700px)').matches) {
      if ($('.overlayCover').css('display') == 'block') {
        $('.overlayCover').hide()
        $('.current-activity-content').hide()
      } else {
        $('.overlayCover').show()
        $('.current-activity-content').show()
      }
    }
  })
})
