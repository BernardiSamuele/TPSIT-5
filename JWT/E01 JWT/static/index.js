'use strict';
$(document).ready(function () {
  let tBody = $('#tabMail tbody');

  getMails();

  function getMails() {
    let mailRQ = inviaRichiesta('GET', '/api/elencoMail');
    mailRQ.then(function (response) {
      $('.container').css('visibility', 'visible');
      $('#txtTo').val('');
      $('#txtSubject').val('');
      $('#txtMessage').val('');
      tBody.empty();
      for (let mail of response.data) {
        let tr = $('<tr>');
        let td;
        td = $('<td>').text(mail.from).appendTo(tr);
        td = $('<td>').text(mail.subject).appendTo(tr);
        td = $('<td>').text(mail.body).appendTo(tr);
        tBody.append(tr);
      }
    });
    mailRQ.catch(errore);
  }

  $('#btnInvia').on('click', function () {
    let mail = {
      to: $('#txtTo').val(),
      subject: $('#txtSubject').val(),
      message: $('#txtMessage').val()
    };
    let newMailRQ = inviaRichiesta('POST', '/api/newMail', mail);
    newMailRQ.then(function (response) {
      console.log(response.data);
      alert(response.data.ris);
    });
    newMailRQ.catch(errore);
  });

  /* ************************* LOGOUT  *********************** */

  /*  Per il logout è inutile inviare una richiesta al server.
		E' sufficiente cancellare il cookie o il token dal pc client
		Se si utilizzano i cookies la gestione lato client è trasparente,
		per cui in quel caso occorre inviare una richiesta al server        */

  // if using http headers
  $('#btnLogout').on('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  /* if using cookies 
	$("#btnLogout").on("click", function() {
		let rq = inviaRichiesta('POST', '/api/logout');
		rq.done(function(data) {
			window.location.href = "login.html"
		});
		rq.fail(errore)		
	}) 
	*/
});
