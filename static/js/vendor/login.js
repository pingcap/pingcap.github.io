$('document').ready(function() {

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: 'openid profile',
  });

  var authResult
  var userProfile

  // proccess login
  $('#qsLoginBtn').click(function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  $('#topLoginBtn').click(function(e) {
      e.preventDefault();
      webAuth.authorize();
    });

  // process logout
  $('#qsLogoutBtn').click(function(e) {
    e.preventDefault();
    localStorage.clear()
    webAuth.logout({
      returnTo: AUTH0_LOGOUT_URL,
      client_id: AUTH0_CLIENT_ID
    })
  });

  function setSession() {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    webAuth.client.userInfo(authResult.accessToken, function (err, profile) {
      userProfile = profile
      localStorage.setItem('sub', userProfile.sub)
      localStorage.setItem('username', userProfile.name)
      localStorage.setItem('nickname', userProfile.nickname)
      localStorage.setItem('avatar', userProfile.picture)
      localStorage.setItem('email', userProfile.name)
      $('#j-username').text(localStorage.username)
      $('.j-avatar').attr('src', localStorage.avatar)
    })
  }

  $('.submit-button').click(function(e) {
    e.preventDefault()
    $.ajax({
      async: true,
      acrossDomain: true,
      url: "https://" + AUTH0_DOMAIN + "/dbconnections/change_password",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      processData: false,
      data: JSON.stringify({
        client_id: AUTH0_CLIENT_ID,
        email: localStorage.email,
        connection: "Username-Password-Authentication"
      })
    }).done(function (response) {
      $('.profile-form').css('display', 'none')
      $('.emailsent').css('display', 'inline')
    });
  })

  // Check whether the current time is past the
  // access token's expiry time
  function isAuthenticated() {
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  // parse access token and set sesstion
  function handleAuthentication() {
    webAuth.parseHash(function (err, authenticationRes) {
      authResult = authenticationRes
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ''
        setSession();
      } else if (err) {
        console.log('Error inside handleAuthentication', err)
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
    });
  }

  $('.navbar__item').click(function(e) {
    if ($('.dropdown').css('display') == 'none') {
      $('.dropdown').css('display', 'block')
      $('.dropdown').fadeIn()
    } else {
      $('.dropdown').css('display', 'none')
      $('.dropdown').fadeOut()
    }
  })

  handleAuthentication();
});
