'use strict';

$(document).ready(function () {
  let user = null;
  const _login = $('#login');
  const _mail = $('#mail');

  const _username = $('#usr');
  const _password = $('#pwd');
  const _lblErrore = $('#lblErrore');
  const _btnInvia = $('#btnInvia');
  const _btnLogin = $('#btnLogin');

  _mail.hide();

  _lblErrore.hide();
  _lblErrore.children('button').on('click', function () {
    _lblErrore.hide();
  });

  _btnLogin.on('click', async function () {
    if (_username.val() && _password.val()) {
      const response = await inviaRichiesta('POST', '/api/login', { username: _username.val(), password: _password.val() });
      if (response.status === 200) {
        user = _username.val();
        _mail.show();
        _login.hide();
        loadMail(response.data);
      } else {
        _mail.hide();
      }
    } else {
      _lblErrore.show();
    }
  });

  _btnInvia.on('click', async function () {
    const formData = new FormData();
    formData.append('from', user);
    formData.append('to', $('#txtTo').val());
    formData.append('subject', $('#txtSubject').val());
    formData.append('message', $('#txtMessage').val());
    formData.append('attachment', $('#txtAttachment').prop('files')[0]);
    const response = await inviaRichiesta('POST', '/api/sendMail', formData);
    if (response.status === 200) {
      alert('Email inviata correttamente');
    } else if (response.status === 400) {
      alert('Compilare tutti i campi');
    } else if (response.status === 503) {
      alert('Destinatario non trovato');
    }
  });

  function loadMail(mail) {
    const _tabMail = $('#tabMail tbody');
    _tabMail.empty();
    for (const element of mail.reverse()) {
      _tabMail.append(
        $('<tr>')
          .append($('<td>').text(element.from))
          .append($('<td>').text(element.subject))
          .append($('<td>').text(element.body))
          .append(
            $('<td>').append(
              $('<a>')
                .prop({ href: `/img/${element.attachment}`, target: '_blank' })
                .text(element.attachment)
            )
          )
      );
    }
  }
});
