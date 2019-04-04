const openVideoModal = () => {
  $('.j-video-overlay').fadeIn()
  $('.j-video-overlay, .modal').addClass('active')
}

const closeModal = () => {
  $('.modal-overlay').fadeOut()
  $('.modal-overlay, .modal').removeClass('active')
  $('#video-on-modal')[0].pause()
}

$(function() {
  $('.j-video-btn').on('click', function(e) {
    var screenWidth = $(window).width()

    if (screenWidth < 800) {
      var videoSRC = $(this).attr('data-tencent-video')
      window.location.href = videoSRC
    } else {
      var videoSRC = $(this).attr('data-video')
      openVideoModal()

      $('#video-on-modal')
        .get(0)
        .pause()
      $('#video-on-modal source').attr('src', videoSRC)
      $('#video-on-modal')
        .get(0)
        .load()
      $('#video-on-modal')
        .get(0)
        .play()
    }

    e.preventDefault()
    e.stopPropagation()
  })

  $('.close-modal')
    .off('click')
    .on('click', function(e) {
      closeModal()
      e.preventDefault()
      e.stopPropagation()
    })
})
