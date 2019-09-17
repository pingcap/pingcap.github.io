;(function() {
  $('.content.markdown-body')
    .find('h1, h2, h3, h4, h5, h6')
    .each(function() {
      const that = $(this)

      const newId = that
        .text()
        .replace(/\s/g, '-')
        .replace(/[\.\:：,，\?？、&]/g, '')
        .toLowerCase()
      that.attr('id', newId)

      const link = $(
        `<a class="title-anchor hidden" href="${window.location.href +
          '#' +
          newId}"><img src="/images/svgs/link.svg" /></a>`
      )
      that.append(link)

      that.hover(
        function() {
          link.removeClass('hidden')
        },
        function() {
          link.addClass('hidden')
        }
      )
    })
})()
