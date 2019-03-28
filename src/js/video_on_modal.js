const openVideoModal = () => {
  $('.j-video-overlay').fadeIn()
  $('.j-video-overlay, .modal').addClass('active')
  autoPlayVideoInWeXin()
}

const autoPlayVideoInWeXin = () => {
  document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    $('#video')[0].play()
  })
}

const closeModal = () => {
  $('.modal-overlay').fadeOut()
  $('.modal-overlay, .modal').removeClass('active')
  $('#video-modal')[0].pause()
}

$(function() {
  $('.j-video-btn').on('click', function(e) {
    var theModal = $(this).data('target')
    var videoSRC = $(this).attr('data-video')
    $('#video-modal').attr('src', videoSRC)
    $('#video-modal')[0].play()
    openVideoModal()
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
