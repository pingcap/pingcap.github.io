function handleWindowResize() {
  console.log('handling window resize...')
  var BW = $('.banner__container').width()
  console.log('bw is: ', BW, $('.banner__container').css('height', BW / 2.67))
  $('.banner__container').css('height', BW / 2.67)
}

$(document).ready(function() {
  var calendars = {}
  var thisMonth = moment().format('YYYY-MM')
  // Events to load into calendar
  var eventArray = [
    {
      title: 'Multi-Day Event',
      endDate: thisMonth + '-14',
      startDate: thisMonth + '-10',
    },
    {
      endDate: thisMonth + '-23',
      startDate: thisMonth + '-21',
      title: 'Another Multi-Day Event',
    },
    {
      date: thisMonth + '-27',
      title: 'Single Day Event',
    },
  ]
  // set banner height
  // var BW = $('.banner__container').width()
  // $('.banner__container').css('height', BW / 2.67)
  // $(window).resize(handleWindowResize)
  calendars.clndr2 = $('.cal2').clndr({
    lengthOfTime: {
      days: 14,
      interval: 7,
    },
    events: eventArray,
    multiDayEvents: {
      singleDay: 'date',
      endDate: 'endDate',
      startDate: 'startDate',
    },
    template: $('#template-calendar').html(),
    clickEvents: {
      click: function(target) {
        console.log('Cal-2 clicked: ', target)
      },
      nextInterval: function() {
        console.log('Cal-2 next interval')
      },
      previousInterval: function() {
        console.log('Cal-2 previous interval')
      },
      onIntervalChange: function() {
        console.log('Cal-2 interval changed')
      },
    },
  })
})
