const rankURL = 'https://internal.pingcap.net/pcp/api/rank'
const rankSeason1URL = 'https://internal.pingcap.net/pcp/api/rank/season/1'

const season = $('#tpc-ranking-switch .first')
const history = $('#tpc-ranking-switch .second')

function renderData(data) {
  data
    .sort((a, b) => b.rank - a.rank)
    .map((d, i) => {
      const percent = (d.score / 100).toFixed(0)
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
            <progress class="progress" value="${percent}" max="10000">${percent}%</progress>
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
  } else {
    url = rankURL
  }

  $.getJSON(url, data => {
    $('#ranking-list').empty()

    if (isSeason) {
      season.addClass('active')
      history.removeClass('active')
    } else {
      history.addClass('active')
      season.removeClass('active')
    }

    renderData(data)
  })
}

season.on('click', () => getRankData(true))

history.on('click', () => getRankData())

$(document).ready(() => getRankData(true))
