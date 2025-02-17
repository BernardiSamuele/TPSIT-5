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

  function controllaLogin() {
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
      let request = inviaRichiesta('POST', '/api/login', { username: _username.val(), password: _password.val() });
      request.catch(function (err) {
        if (err.response.status == 401) {
          // unauthorized
          _lblErrore.show();
        } else errore(err);
      });
      request.then(function (response) {
        window.location.href = 'index.html';
      });
    }
  }

  _lblErrore.children('button').on('click', function () {
    _lblErrore.hide();
  });
});
