// JS Goes here - ES6 supported

// Recruit Pages

$(function() {
  // Process Typed terminal
  var sqlTyped = new Typed('#typedSelect', {
    strings: ['tidb> select * from pingcap.milestones order by date desc;'],
    typeSpeed: 50, // typing speed
    backSpeed: 0,
    showCursor: false,
    loop: false,
    onComplete: function(self) {
      setTimeout(function() {
        $('.table-content').show()
        $('.terminal').animate({ scrollTop: $('.terminal').height() }, 'slow')
      }, 500)
    },
  })

  // Handle hide message click event
  $('.hider').click(function() {
    $(this)
      .parent('.message')
      .removeClass('blur')
  })

  // process image: lazy load and add fade in effect
  $('.lazy').lazyload({
    threshold: 200,
    effect: 'fadeIn',
  })
})
