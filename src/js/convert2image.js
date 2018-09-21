// convert html to canvas, then convert canvas to image
const convert2image = () => {
  var shareContent = document.body
  var width = shareContent.offsetWidth
  var height = shareContent.offsetHeight
  var scale = 3
  var canvas = document.createElement('canvas')

  // fix font issue
  shareContent.style.fontFeatureSettings = '"liga" 0'

  canvas.width = width * scale
  canvas.height = height * scale
  canvas.getContext('2d').scale(scale, scale) //获取context,设置scale

  var opts = {
    scale: scale,
    canvas: canvas,
    useCORS: true,
    logging: true,
    letterRendering: true,
    width: width,
    height: height,
  }

  html2canvas(shareContent, opts).then(function(canvas) {
    $('.share-section').remove()

    var context = canvas.getContext('2d')

    // 【重要】关闭抗锯齿
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.msImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

    // convert to PNG by default
    // var img = Canvas2Image.convertToImage(canvas, canvas.width, canvas.height)
    // convert to JPEG
    // 安卓版微信中所生成的图片尽管能长按唤出保存图片的菜单，但是无法正确保存到本地相册。
    // 解决方案：设置canvas2img的生成图片格式配置项为 JPEG 即可。
    var img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height)

    $('.j-capture-image').html(img)

    $(img).css({
      width: canvas.width / scale * 0.6 + 'px',
      height: canvas.height / scale * 0.6 + 'px',
    })
  })
}

$(function() {
  // camera button
  $('.j-camera').on('click', function() {
    if ($('.html2image-container').hasClass('show'))
      $('.html2image-container').removeClass('show')
    else $('.html2image-container').addClass('show')
  })
  // capture picture button
  $('.j-capture').on('click ', function() {
    // add share section
    // TODO: replace qr code
    $('.html2image-section').append(
      '<div class="share-section"><div class="text">Scan the QR Code to explore more about TiDB!</div><img src="/images/qrcode-min.jpg" alt="" /></div>'
    )
    // open capture overlay
    $('.j-capture-overlay').fadeIn()
    $('.j-capture-overlay, .modal').addClass('active')

    convert2image()
  })
})
