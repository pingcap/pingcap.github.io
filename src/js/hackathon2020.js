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

function processDate() {
  const date = new Date()
  const today =
    date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate()
  const milestones = [
    '2020.12.15',
    '2021.1.10',
    '2021.1.11',
    '2021.1.16',
    '2021.1.17',
  ]
  const moments = $('.moment-item')

  if (today <= milestones[0]) {
    $(moments[0]).addClass('active')
  } else if (today <= milestones[1]) {
    $(moments[1]).addClass('active')
  } else if (today < milestones[3]) {
    $(moments[2]).addClass('active')
  } else if (today < milestones[4]) {
    $(moments[3]).addClass('active')
  } else {
    $(moments[4]).addClass('active')
  }
}

$(document).ready(function() {
  // auto active nav item with hash
  processNavbar()

  // auto active current milestone in moments
  processDate()

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
