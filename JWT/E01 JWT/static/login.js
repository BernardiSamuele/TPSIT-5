'use strict';

$(document).ready(function () {
  const _username = $('#usr');
  const _password = $('#pwd');
  const _lblErrore = $('#lblErrore');

  _lblErrore.hide();

  $('#btnLogin').on('click', controllaLogin);

  // il submit deve partire anche senza click
  // con il solo tasto INVIO
  $(document).on('keydown', function (event) {
    if (event.keyCode == 13) controllaLogin();
  });

  async function controllaLogin() {
    _username.removeClass('is-invalid');
    _username.prev().removeClass('icona-rossa');
    _password.removeClass('is-invalid');
    _password.prev().removeClass('icona-rossa');

    _lblErrore.hide();

    if (_username.val() == '') {
      _username.addClass('is-invalid');
      _username.prev().addClass('icona-rossa');
    } else if (_password.val() == '') {
      _password.addClass('is-invalid');
      _password.prev().addClass('icona-rossa');
    } else {
      let httpResponse = await inviaRichiesta('POST', '/api/login', { username: _username.val(), password: _password.val() });
      if (httpResponse.status != 200) {
        if (httpResponse.status == 401) {
          _lblErrore.show();
        } else {
          alert(httpResponse.err);
        }
      } else {
        window.location.href = '/index.html';
      }
    }
  }

  _lblErrore.children('button').on('click', function () {
    _lblErrore.hide();
  });
});
