const rankURL = 'https://bots.tidb.io/ti-challenge-bot/program/2/ranks'

function renderData() {
  $.getJSON(rankURL, resData => {
    $('#ranking-list').empty()

    if (resData.data.length > 0) {
      resData.data
        .sort((a, b) => b.score - a.score)
        .map((d, i) => {
          $(
            '<div class="ranking-item">' +
              (i < 3
                ? '<div class="medal medal' + (i + 1) + '"></div>'
                : '<div class="medal normal-rank"></div>') +
              '<div class="progress-wrapper">\
              <div class="team-name">' +
              d.team.teamName +
              '</div>\
              <div class="score">' +
              d.score +
              '</div>\
              <progress class="progress" value="' +
              d.score +
              '" max="10000" />\
            </div>\
        </div>'
          ).appendTo('#ranking-list')
        })
    } else {
      $('<div>本排行榜积分更新时间为 2020.9.17 至 2020.11.15 </div>').appendTo(
        '#ranking-list'
      )
    }
  })
}

function getURLParams() {
  let utmSource = 'pingcap'
  let utmMediuBanner = 'banner'
  let utmMediumStep = 'step'
  let utmCampaign = 'hptc'
  let params = window.location.search.slice(1).split('&')

  let paramsObj = {}
  if (params.length > 1) {
    params.forEach(p => {
      paramsObj[p.split('=')[0]] = p.split('=')[1]
    })

    utmSource = paramsObj['utm_source']
    utmMediuBanner = paramsObj['utm_medium']
    utmMediumStep = paramsObj['utm_medium']
    utmCampaign = paramsObj['utm_campaign']
  }

  let registerBtnURLBanner =
    'https://forms.pingcap.com/f/high-performance-challenge-cn?' +
    'utm_source=' +
    utmSource +
    '&utm_medium=' +
    utmMediuBanner +
    '&utm_campaign=' +
    utmCampaign

  let registerBtnURLStep =
    'https://forms.pingcap.com/f/high-performance-challenge-cn?' +
    'utm_source=' +
    utmSource +
    '&utm_medium=' +
    utmMediumStep +
    '&utm_campaign=' +
    utmCampaign

  document.getElementById('register-btn-banner').href = registerBtnURLBanner
  document.getElementById('register-btn-step').href = registerBtnURLStep
}

$(document).ready(function() {
  renderData()
  getURLParams()

  if (window.matchMedia('(max-width:550px)').matches) {
    $('.list-card').click(function() {
      $('.detail-mobile').css('display', 'none')
      let index = $('.list-card').index($(this)) + 1
      $('.detail-' + index).css('display', 'block')
    })
  }
})
