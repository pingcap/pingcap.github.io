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
  const milestones = ['2021.1.10', '2021.1.11', '2021.1.16', '2021.1.17']
  const hackingCampMilestones = ['2021.3.14', '2021.3.21', '2021.4.26', '2021.4.29']
  const moments = $('.hackathon-moment-item')
  const hackingMoments = $('.hacking-camp-moment')

  if (today <= milestones[0]) {
    // ~ 2020.1.10
    $(moments[0]).addClass('active')
  } else if (today < milestones[2]) {
    // 2021.1.11 ~ 2021.1.15
    $(moments[1]).addClass('active')
  } else if (today < milestones[3]) {
    // 2021.1.16 ~ 2021.1.17
    $(moments[2]).addClass('active')
  } else {
    // 2021.1.17 ~
    $(moments[3]).addClass('active')
  }

  if (today <= hackingCampMilestones[0]) {
    // ~ 2021.02.23
    $(hackingMoments[0]).addClass('active')
  } else if (today < hackingCampMilestones[2]) {
    // 2021.03.15 ~ 2021.03.20
    $(hackingMoments[1]).addClass('active')
  } else if (today < hackingCampMilestones[3]) {
    // 2021.04.20 ~ 2021.04.25
    $(hackingMoments[2]).addClass('active')
  } else {
    // 2021.04.28 ~
    $(hackingMoments[3]).addClass('active')
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

  $('.j-open-agenda-modal').click(function() {
    $('.j-agenda-overlay').fadeIn()
    $('.j-agenda-overlay, .modal').addClass('active')
  })

  $('.j-open-criteria-modal').click(function() {
    $('.j-criteria-overlay').fadeIn()
    $('.j-criteria-overlay, .modal').addClass('active')
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
