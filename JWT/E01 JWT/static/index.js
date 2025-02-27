'use strict';
$(document).ready(function () {
  let tBody = $('#tabMail tbody');

  $('.container').css('visibility', 'hidden');
  getMails();

  async function getMails() {
    let httpResponse = await inviaRichiesta('GET', '/api/elencoMail');
    if (httpResponse.status == 200) {
      $('.container').css('visibility', 'visible');
      $('#txtTo').val('');
      $('#txtSubject').val('');
      $('#txtMessage').val('');
      tBody.empty();
      for (let mail of httpResponse.data) {
        let tr = $('<tr>');
        let td;
        td = $('<td>').text(mail.from).appendTo(tr);
        td = $('<td>').text(mail.subject).appendTo(tr);
        td = $('<td>').text(mail.body).appendTo(tr);
        tBody.append(tr);
      }
    } else {
      if (httpResponse.status == 403) {
        window.location.href = '/login.html';
      } else {
        alert(httpResponse.status + ': ' + httpResponse.err);
      }
    }
  }

  $('#btnInvia').on('click', async function () {
    let mail = {
      to: $('#txtTo').val(),
      subject: $('#txtSubject').val(),
      message: $('#txtMessage').val()
    };
    let httpResponse = await inviaRichiesta('POST', '/api/newMail', mail);
    if (httpResponse.status == 200) {
      console.log(httpResponse.data);
      alert(httpResponse.data.ris);
    } else {
      if (httpResponse.status == 403) {
        window.location.href = '/login.html';
      } else {
        alert(httpResponse.status + ': ' + httpResponse.err);
      }
    }
  });

  /* ************************* LOGOUT  *********************** */

  /*  Per il logout è inutile inviare una richiesta al server.
		E' sufficiente cancellare il cookie o il token dal pc client
		Se si utilizzano i cookies la gestione lato client è trasparente,
		per cui in quel caso occorre inviare una richiesta al server        */

  // if using http headers
  // $('#btnLogout').on('click', function () {
  //   localStorage.removeItem('token');
  //   window.location.href = 'login.html';
  // });

  // if using cookies
  $('#btnLogout').on('click', async function () {
    const httpResponse = await inviaRichiesta('POST', '/api/logout');
    if (httpResponse.status == 200) {
      window.location.href = 'login.html';
    } else {
      alert(httpResponse.status + ': ' + httpResponse.err);
    }
  });
});
