function calcBannerTitleImg() {
  if (window.matchMedia('(max-width: 700px)').matches) {
    $('.signable img').attr(
      'src',
      'https://download.pingcap.com/images/community/activities/meetup.svg'
    )
    // $('.signable img').attr(
    //   'src',
    //   'https://download.pingcap.com/images/mobileDevCon.png'
    // )
  } else {
    $('.signable img').attr(
      'src',
      'https://download.pingcap.com/images/community/activities/meetup-active-img.jpg'
    )
    // $('.signable img').attr(
    //   'src',
    //   'https://download.pingcap.com/images/PCdevCon.png'
    // )
  }
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
  var events = []
  if ($('.feature-activity').length) {
    console.log('has feature activity')
    $('.feature-activity').each(function() {
      var date = $(this)[0].children[1].innerText
      var y = new Date(date).getFullYear()
      var m = new Date(date).getMonth() + 1
      var d = new Date(date).getDate()
      var title =
        $(this)[0].children[0].innerText +
        ', ' +
        $(this)[0].children[3].innerText
      events.push({
        Title: title,
        Date: new Date(y, m, d),
        Link: $(this)[0].children[2].innerText,
      })
    })
  }

  var settings = {
    test: 'testme',
  }

  var element = document.getElementById('calendar')
  if (element) {
    calendar(element, events, settings)
  }

  // setClndrHeight()
  calcBannerTitleImg()
  $(window).resize(calcBannerTitleImg)

  // scrolls to specific section smoothly
  const hash = decodeURIComponent(location.hash)
  var extraH_contributor
  var extraH_arch
  if (window.matchMedia('(max-width: 500px)').matches) {
    extraH_contributor = 60
    extraH_arch = 60
  } else {
    extraH_contributor = 250
    extraH_arch = 60
  }
  if (hash) {
    if (hash == '#activities') {
      console.log('activities', extraH_arch)
      $('html, body').animate(
        {
          scrollTop: $('.activity__section').offset().top - extraH_arch,
        },
        1000
      )
    }
  }
  // displays events in this selected day
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

  var contentTabID = $('input:checked').val()

  $('.schedules').hide()
  $('#' + contentTabID).show()
  $('input').on('click', function() {
    contentTabID = $('input:checked').val()
    $('.schedules').hide()
    $('#' + contentTabID).show()
  })

  $('.city').click(function() {
    $('.city').removeClass('schedule-btn-checked')
    $('.city').removeClass('mobile-btn-checked')
    $('.red-spot-t').removeClass('schedule-circle-checked')
    $('.red-spot-b').removeClass('schedule-circle-checked')
    $(this).addClass('schedule-btn-checked')
    $(this).addClass('mobile-btn-checked')
    $('.schedules').hide()
    // console.log('checked label: ', $('input:checked').val())
    // $('input:checked').attr('checked', 'checked')
    $('#' + $(this).attr('id') + '-schedule').show()
    $('#' + $(this).attr('id') + 'Tab').attr('checked', 'checked')
    $(this)
      .parent()
      .addClass('schedule-circle-checked')
    console.log('this: ', $(this)[0].parentElement.className)
    $('html, body').animate(
      {
        scrollTop: $('.agenda__section').offset().top - 60,
      },
      1000
    )
  })
})
