const rankURL = 'https://internal.pingcap.net/pcp/api/rank'
const rankSeason1URL = 'https://internal.pingcap.net/pcp/api/rank/season/1'

const season = $('#tpc-ranking-switch .first')
const history = $('#tpc-ranking-switch .second')
const slider = $('#tpc-ranking-switch .slider')

var sliderTextIsseason, sliderTextHistory

if($('.slider').data('lang') == "cn") {
  sliderTextIsseason = "赛季积分"
  sliderTextHistory = "历史积分"
} else {
  if(window.matchMedia('(max-width: 768px)').matches) {
    sliderTextIsseason = "S1 CC"
    sliderTextHistory = "CC History"
  } else {
    sliderTextIsseason = "S1 Contribution Credit"
    sliderTextHistory = "Contribution Credit History"
  } 
}

function renderData(data) {
  data
    .sort((a, b) => b.score - a.score)
    .map((d, i) => {
      $(`
      <div>
        ${
          i < 3
            ? `<div class="medal medal${i + 1}"></div>`
            : `<div class="index">${i + 1}</div>`
        }
        <div class="github"></div>
        <div class="main">
          <div class="info">
            <div class="name">${d.name}${
        !d.community ? ' <span class="ti"></span>' : ''
      }${d.type === 'team' ? ' <span class="team">Team</span>' : ''}</div>
            <div class="score">${d.score}</div>
          </div>
          <div class="progress-wrapper">
            <progress class="progress" value="${d.score}" max="10000" />
          </div>
        </div>
      </div>
    `).appendTo('#ranking-list')
    })
}

function getRankData(isSeason) {
  let url

  if (isSeason) {
    url = rankSeason1URL
    slider.text(sliderTextIsseason)
    slider.css('left', '1rem')
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

$(document).ready(() => 
  getRankData(true),
  $('.first')[0].innerText = sliderTextIsseason,
  $('.second')[0].innerText = sliderTextHistory
)
