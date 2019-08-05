// play video
const playVideo = function() {
  $('#video').attr('controls', 'controls')
  // for safari
  var promise = document.getElementById('video').play()
  if (promise !== undefined) {
    promise
      .then(_ => {
        // Autoplay started!
      })
      .catch(error => {
        // Autoplay was prevented.
        // Show a "Play" button so that user can start playback.
      })
  }
}

const particlesConfig = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: '#000000',
    },
    shape: {
      type: 'polygon',
      stroke: {
        width: 0,
        color: '#ffffff',
      },
      polygon: {
        nb_sides: 5,
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100,
      },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false,
      },
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#000000',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
        mode: 'repulse',
      },
      onclick: {
        enable: true,
        mode: 'push',
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
}

function calcOfficePosition() {
  var mapW = $('.pc-map').width()
  var mapH = $('.pc-map').height()

  $('.m-silicon').css('left', 0.16 * mapW)
  $('.m-silicon').css('top', 0.37 * mapH)

  $('.m-beijing').css('right', 0.19 * mapW)
  $('.m-beijing').css('top', 0.28 * mapH)

  $('.m-shanghai').css('right', 0.19 * mapW)
  $('.m-shanghai').css('top', 0.34 * mapH)

  $('.m-hangzhou').css('right', 0.2 * mapW)
  $('.m-hangzhou').css('top', 0.37 * mapH)

  $('.m-shenzhen').css('right', 0.21 * mapW)
  $('.m-shenzhen').css('top', 0.42 * mapH)

  $('.m-chengdu').css('right', 0.28 * mapW)
  $('.m-chengdu').css('top', 0.34 * mapH)

  $('.m-guangzhou').css('right', 0.225 * mapW)
  $('.m-guangzhou').css('top', 0.41 * mapH)
  
}

$(document).ready(function() {
  $('#video-control').click(function(e) {
    const videoEl = document.getElementById('video')
    if (videoEl.paused) {
      $('#video-control .icon').css('opacity', '0')
      playVideo()
    } else {
      videoEl.pause()
    }
    e.preventDefault()
  })
  $('#video').focus(function(e) {
    $(this).attr('controls', 'controls')
    e.preventDefault()
  })

  if (particlesJS)
    particlesJS('particles-js', particlesConfig, function() {
      console.log('callback - particles.js config loaded')
    })

  $('.pc-map').on('load', calcOfficePosition())

  $(window).resize(calcOfficePosition)

  $('.m-office').hover(function(){
    $(this).addClass('m-office-hovered')
    var idx = $(this).index()
    let addr = $('.office-info')[idx-1]
    let $addr = $(addr)
    $(addr).addClass('underline')
  }, function(){
    $(this).removeClass('m-office-hovered')
    $('.office-info').removeClass('underline')
  })
})
