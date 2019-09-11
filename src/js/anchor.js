;(function() {
  $('.content.markdown-body')
    .find('h1, h2, h3, h4, h5, h6')
    .each(function() {
      var that = $(this)
      var newId = that
        .text()
        .replace(/\s/g, '-')
        .replace(/[\.\:：,，\?？、&]/g, '')
        .toLowerCase()
      that.attr('id', newId)
    })
})()
