;(function() {
  $('.content.markdown-body')
    .children('h1, h2, h3, h4, h5, h6')
    .each(function() {
      var that = $(this)
      var newId = that
        .text()
        .replace(/\s/g, '-')
        .toLowerCase()
      that.attr('id', newId)
    })
})()
