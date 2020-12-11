const rankURL = 'https://internal.pingcap.net/bcp/api/rank/all'
const rankSeasonURL = 'https://internal.pingcap.net/bcp/api/rank'

const season = $('#ranking-switch .first')
const history = $('#ranking-switch .second')
const slider = $('#ranking-switch .slider')

let sliderTextSeason, sliderTextHistory

if (slider.data('lang') === 'cn') {
  sliderTextSeason = '赛季积分'
  sliderTextHistory = '历史积分'
} else {
  sliderTextSeason = 'Current'
  sliderTextHistory = 'Accumulative'
}

function renderData(data) {
  if (data) {
    data
      .sort((a, b) => b.score - a.score)
      .forEach((d, i) =>
        $(
          '<div>' +
            (i < 3
              ? '<div class="medal medal' + (i + 1) + '"></div>'
              : '<div class="index">' + (i + 1) + '</div>') +
            '<div class="github"></div>\
          <div class="main">\
            <div class="info">\
              <div class="name">' +
            d.name +
            (!d.community ? ' <span class="ti"></span>' : '') +
            (d.type === 'team' ? ' <span class="team">Team</span>' : '') +
            '</div>\
              <div class="score">' +
            d.score +
            '</div>\
            </div>\
            <div class="progress-wrapper">\
              <progress class="progress" value="' +
            d.score +
            '" max="10000" />\
            </div>\
          </div>\
        </div>'
        ).appendTo('#ranking-list')
      )
  }
}

function getRankData(isSeason) {
  let url

  if (isSeason) {
    url = rankSeasonURL
    slider.text(sliderTextSeason)
    if (window.matchMedia('(max-width: 768px)').matches) {
      slider.css('left', '1rem')
    } else {
      slider.css('left', 'calc(30% + 1rem)')
    }
  } else {
    url = rankURL
    slider.text(sliderTextHistory)
    slider.css('left', 'calc(50% - 1rem)')
  }

  $.getJSON(url, data => {
    $('#ranking-list').empty()

    renderData(data)
  })
}

season.on('click', () => getRankData(true))

history.on('click', () => getRankData())

$(document).ready(() => {
  getRankData(true)

  const slidesPerView = !window.matchMedia('(max-width: 768px)').matches ? 3 : 1
  new Swiper('.swiper-container', {
    autoplay: {
      delay: 6000,
    },
    loop: true,
    slidesPerView,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })
})
