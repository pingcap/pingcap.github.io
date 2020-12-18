const elem =
  '<div id="mc_embed_signup">\
<form\
  action="//pingcap.us16.list-manage.com/subscribe/post?u=ab57beb8a88391cf6193c1b48&amp;id=7c67af4f9d"\
  method="post"\
  id="mc-embedded-subscribe-form"\
  name="mc-embedded-subscribe-form"\
  class="validate"\
  target="_blank"\
  novalidate\
>\
  <div id="mc_embed_signup_scroll">\
    <div class="form-inline">\
      <input\
        type="email"\
        value=""\
        name="EMAIL"\
        id="mce-EMAIL"\
        class="form-control"\
        placeholder="Subscribe to our newsletter"\
      />\
      <input\
        type="submit"\
        value="Subscribe"\
        name="subscribe"\
        id="mc-embedded-subscribe"\
        class="btn btn-subscribe f-tc"\
      />\
    </div>\
    <div id="mce-responses" class="clear">\
      <div\
        class="response"\
        id="mce-error-response"\
        style="display: none;"\
      ></div>\
      <div\
        class="response"\
        id="mce-success-response"\
        style="display: none;"\
      ></div>\
    </div>\
    <div style="position: absolute; left: -5000px;" aria-hidden="true">\
      <input\
        type="text"\
        name="b_ab57beb8a88391cf6193c1b48_7c67af4f9d"\
        tabindex="-1"\
        value=""\
      />\
    </div>\
  </div>\
</form>\
</div>\
<script src="https://download.pingcap.com/js/mc-validate.js"></script>\
'

{/* <script src="https://download.pingcap.com/js/mc-validate.js"></script>\ */}

export function dynamicAddSubscribeForm() {
  if (window.matchMedia('(max-width: 879px)').matches) {
    $(elem).appendTo('#subscribe-mobile')
  } else {
    $(elem).appendTo('#subscribe-pc')
  }

  window.fnames = new Array()
  window.ftypes = new Array()
  fnames[0] = 'EMAIL'
  ftypes[0] = 'email'
  fnames[1] = 'FNAME'
  ftypes[1] = 'text'
  fnames[2] = 'LNAME'
  ftypes[2] = 'text'
}
