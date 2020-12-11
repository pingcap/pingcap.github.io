function processNavbar() {
  const hash = decodeURIComponent(location.hash)
  if (!hash) return

  const navItem = $('.navbar__item a').filter(function() {
    return $(this).attr('href') === hash
  })

  if (!navItem) return

  navItem.parent().addClass('active')
}

function closeModal() {
  $('.modal-overlay').fadeOut()
  $('.modal-overlay, .modal').removeClass('active')
}

$(document).ready(function() {
  // auto active nav item with hash
  processNavbar()

  $('.navbar__item').click(function() {
    $(this)
      .parent()
      .children('.navbar__item')
      .removeClass('active')

    $(this).addClass('active')
  })

  // toggle answers when click question
  $('.question').click(function() {
    $(this)
      .parent()
      .siblings()
      .children('.question')
      .removeClass('expand')
    $(this)
      .next()
      .slideToggle()
    $(this).toggleClass('expand')
    $(this)
      .parent()
      .siblings()
      .children('.answer')
      .slideUp()
  })

  $('.j-open-schedule-modal').click(function() {
    $('.j-schedule-overlay').fadeIn()
    $('.j-schedule-overlay, .modal').addClass('active')
  })

  $('.j-open-grading-modal').click(function() {
    $('.j-grading-overlay').fadeIn()
    $('.j-grading-overlay, .modal').addClass('active')
  })

  $('.modal-overlay').on('click', function(e) {
    if ($(this).hasClass('active')) {
      if (e.target === e.delegateTarget) {
        closeModal()
      }
    }
  })

  $('.close-modal')
    .off('click')
    .on('click', function(e) {
      e.preventDefault()
      e.stopPropagation()
      closeModal()
    })
})
