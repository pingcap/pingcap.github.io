function handleWindowResize() {
  console.log('handling window resize...')
  var BW = $('.banner__container').width()
  console.log('bw is: ', BW, $('.banner__container').css('height', BW / 2.67))
  $('.banner__container').css('height', BW / 2.67)
}

$(document).ready(function() {
  // set banner height
  // var BW = $('.banner__container').width()
  // $('.banner__container').css('height', BW / 2.67)
  // $(window).resize(handleWindowResize)
})
