function handleWebsiteNavDisplay() {
  console.log('scrolling...')
  var scrollVal = $(this).scrollTop(),
    y = $('header').height()

  if (scrollVal > 0) {
    console.log('scrolVal: ', scrollVal)
    $('header').hide()
    $('.devcon-nav').css('top', '0')
    $('.devCon').css('padding-top', y)
  } else {
    $('header').show()
    $('.devcon-nav').css('top', y)
  }
}

$(document).ready(function() {
  if ($('header').length) {
    var header_H = $('header').height()
    console.log('header height is: ', header_H)
    $('.devcon-nav').css('top', header_H)
    $('.devcon-nav').css('height', header_H)
    $('.devCon').css('padding-top', 2 * header_H)
  }

  $(window).scroll(handleWebsiteNavDisplay)

  $(window).resize(function() {
    if ($('header').length) {
      var header_H = $('header').height()
      $('.devcon-nav').css('top', header_H)
      $('.devcon-nav').css('height', header_H)
    }
  })
})
