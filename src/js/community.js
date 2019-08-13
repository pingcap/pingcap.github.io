function calcBannerTitleImg() {
  if (window.matchMedia('(max-width: 700px)').matches) {
    $('.signable img').attr(
      'src',
      'https://download.pingcap.com/images/community/activities/meetup.svg'
    )
  } else {
    $('.signable img').attr(
      'src',
      'https://download.pingcap.com/images/community/activities/meetup-active-img.jpg'
    )
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
    } else if (hash.slice(-9) == '-schedule') {
      console.log('schedule')
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
    console.log('contentID: ', contentTabID)
    $('.schedules').hide()
    $('#' + contentTabID).show()
    $('.city').removeClass('schedule-btn-checked')
    $('.city').removeClass('mobile-btn-checked')
    $('.red-spot-t').removeClass('schedule-circle-checked')
    $('.red-spot-b').removeClass('schedule-circle-checked')
    $(this).addClass('schedule-btn-checked')
    $(this).addClass('mobile-btn-checked')
    switch (contentTabID) {
      case 'beijing-schedule':
        $('.schedule-tabs').css('border-bottom', '1px solid #e66667')
        $('#beijing').addClass('schedule-btn-checked')
        $('#beijing').addClass('mobile-btn-checked')
        $('#beijing')
          .parent()
          .addClass('schedule-circle-checked')
        break
      case 'shanghai-schedule':
        $('.schedule-tabs').css('border-bottom', '1px solid #6dc1b3')
        $('#shanghai').addClass('schedule-btn-checked')
        $('#shanghai').addClass('mobile-btn-checked')
        $('#shanghai')
          .parent()
          .addClass('schedule-circle-checked')
        break
      case 'chengdu-schedule':
        $('.schedule-tabs').css('border-bottom', '1px solid #d68e51')
        $('#chengdu').addClass('schedule-btn-checked')
        $('#chengdu').addClass('mobile-btn-checked')
        $('#chengdu')
          .parent()
          .addClass('schedule-circle-checked')
        break
      case 'shenzhen-schedule':
        $('.schedule-tabs').css('border-bottom', '1px solid #7389b1')
        $('#shenzhen').addClass('schedule-btn-checked')
        $('#shenzhen').addClass('mobile-btn-checked')
        $('#shenzhen')
          .parent()
          .addClass('schedule-circle-checked')
        break
      case 'wuhan-schedule':
        $('.schedule-tabs').css('border-bottom', '1px solid #7769c3')
        $('#wuhan').addClass('schedule-btn-checked')
        $('#wuhan').addClass('mobile-btn-checked')
        $('#wuhan')
          .parent()
          .addClass('schedule-circle-checked')
        break
      case 'hangzhou-schedule':
        $('.schedule-tabs').css('border-bottom', '1px solid #4ba3c9')
        $('#hangzhou').addClass('schedule-btn-checked')
        $('#hangzhou').addClass('mobile-btn-checked')
        $('#hangzhou')
          .parent()
          .addClass('schedule-circle-checked')
        break
    }
  })

  $('.city').click(function() {
    $('.city').removeClass('schedule-btn-checked')
    $('.city').removeClass('mobile-btn-checked')
    $('.red-spot-t').removeClass('schedule-circle-checked')
    $('.red-spot-b').removeClass('schedule-circle-checked')
    $(this).addClass('schedule-btn-checked')
    $(this).addClass('mobile-btn-checked')
    $('.schedules').hide()
    // $('input:checked').attr('checked', 'checked')
    var btnID = $(this).attr('id')
    $('#' + btnID + '-schedule').show()
    switch (btnID) {
      case 'beijing':
        $('.schedule-tabs').css('border-bottom', '1px solid #e66667')
        $('input:radio[name=tabs]')
          .filter('[value=beijing-schedule]')
          .prop('checked', true)
        break
      case 'shanghai':
        $('.schedule-tabs').css('border-bottom', '1px solid #6dc1b3')
        $('input:radio[name=tabs]')
          .filter('[value=shanghai-schedule]')
          .prop('checked', true)
        break
      case 'chengdu':
        $('.schedule-tabs').css('border-bottom', '1px solid #d68e51')
        $('input:radio[name=tabs]')
          .filter('[value=chengdu-schedule]')
          .prop('checked', true)
        break
      case 'shenzhen':
        $('.schedule-tabs').css('border-bottom', '1px solid #7389b1')
        $('input:radio[name=tabs]')
          .filter('[value=shenzhen-schedule]')
          .prop('checked', true)
        break
      case 'wuhan':
        $('.schedule-tabs').css('border-bottom', '1px solid #7769c3')
        $('input:radio[name=tabs]')
          .filter('[value=wuhan-schedule]')
          .prop('checked', true)
        break
      case 'hangzhou':
        $('.schedule-tabs').css('border-bottom', '1px solid #4ba3c9')
        $('input:radio[name=tabs]')
          .filter('[value=hangzhou-schedule]')
          .prop('checked', true)
        break
    }
    $(this)
      .parent()
      .addClass('schedule-circle-checked')
    $('html, body').animate(
      {
        scrollTop: $('.agenda__section').offset().top - 60,
      },
      1000
    )
  })
})
