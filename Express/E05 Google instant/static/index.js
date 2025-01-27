'use strict';

$(document).ready(function () {
  /* ***************** SEZIONE 1 ************************ */
  const _btnAccedi = $('#btnAccedi');
  const _btnRegistrati = $('#btnRegistrati');
  const _divAccedi = $('#divAccedi').hide();
  const _divRegistrati = $('#divRegistrati').hide();
  const _imgProfilo = $('#imgProfilo').hide();
  const _btnEffettuaAccesso = $('#btnEffettuaAccesso');
  const _btnEffettuaRegistrazione = $('#btnEffettuaRegistrazione');

  _btnAccedi.on('click', function () {
    _divAccedi.show();
    _divRegistrati.hide();
  });

  _btnRegistrati.on('click', function () {
    _divAccedi.hide();
    _divRegistrati.show();
  });

  _btnEffettuaAccesso.on('click', async function () {
    const params = {
      username: _divAccedi.find('input[type=text]').val(),
      password: _divAccedi.find('input[type=password]').val()
    };
    const response = await inviaRichiesta('POST', '/api/login', params);
    if (response.status === 401) {
      alert('Credenziali errate');
      return;
    }
    if (response.status !== 200) {
      alert('Errore nel login');
      return;
    }
    _imgProfilo.prop('src', `img/${params.username}.jpg`).show();
    _btnAccedi.hide();
    _divAccedi.hide();
  });

  _btnEffettuaRegistrazione.on('click', async function () {
    const formData = new FormData();
    formData.append('username', _divRegistrati.find('input[type=text]').val());
    formData.append('password', _divRegistrati.find('input[type=password]').val());
    formData.append('img', _divRegistrati.find('input[type=file]').prop('files')[0]);
    const response = await inviaRichiesta('POST', '/api/signup', formData);
    if (response.status === 422) {
      alert('Username già esistente');
      return;
    }
    if (response.status === 400) {
      alert('Compilare tutti i campi');
      return;
    }
    if (response.status !== 200) {
      alert('Errore nel login');
      return;
    }
    _divRegistrati.hide();
  });

  _divAccedi.find('button.annulla').on('click', function () {
    _divAccedi.hide();
  });

  _divRegistrati.find('button.annulla').on('click', function () {
    _divRegistrati.hide();
  });

  /* ***************** SEZIONE 2 ************************ */
  const _txtRicerca = $('#txtRicerca');
  const _lstSuggerimenti = $('#lstSuggerimenti').hide();
  const _divLink = $('#divLink').hide();

  _txtRicerca.on('keyup', async function () {
    if (_txtRicerca.val().trim().length === 0) {
      _lstSuggerimenti.hide();
      return;
    }
    const response = await inviaRichiesta('GET', `/api/search/`, { q: _txtRicerca.val().trim() });
    _lstSuggerimenti.empty();
    _lstSuggerimenti.prop('size', response.data.length + 1);
    for (const element of response.data) {
      _lstSuggerimenti.append($('<option>').text(element.voci.join(' ')).val(element._id));
    }
    _lstSuggerimenti.show();
  });

  _lstSuggerimenti.on('click', async function () {
    _txtRicerca.val(this.options[this.selectedIndex].text);
    _lstSuggerimenti.hide();
    incrementClicks(this.value);
    const response = await inviaRichiesta('GET', `/api/links/`, { _id: this.value });
    if (response.status !== 200) {
      alert('Errore nella lettura dei link');
      return;
    }
    _divLink.empty();
    for (const element of response.data) {
      _divLink.append(
        $('<tr>')
          .append($(`<a href="${element.link}" target="_blank">${element.descrizione}</a>`))
          .append($(`<p>${element.desc}</p>`))
      );
    }
    _divLink.show();
  });

  async function incrementClicks(_id) {
    await inviaRichiesta('PATCH', `/api/incrementClicks/`, { _id });
  }
});
