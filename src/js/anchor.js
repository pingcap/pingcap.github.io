;(function() {
  const ids = $('.content.markdown-body').find('h1, h2, h3, h4, h5, h6')
  let idsText = ids.toArray().map(id => {
    return id.textContent
  })
  const idsMap = new Map()

  idsText = idsText.map(id => {
    if (idsMap.has(id)) {
      const number = idsMap.get(id)
      idsMap.set(id, number + 1)
      return `${id}-${number + 1}`
    } else {
      idsMap.set(id, 0)
      return id
    }
  })

  ids.each(function(index) {
    const that = $(this)

    const newId = idsText[index]
      .replace(/\s/g, '-')
      .replace(/[^-\w\u4E00-\u9FFF]*/g, '')
      .toLowerCase()
    that.attr('id', newId)

    const link = $(
      `<a class="title-anchor hidden" href="${window.location.href.split(
        '#'
      )[0] +
        '#' +
        newId}"><img src="/images/svgs/link.svg" /></a>`
    )
    link.click(function(e) {
      e.preventDefault()

      location.hash = `#${newId}`
    })
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
