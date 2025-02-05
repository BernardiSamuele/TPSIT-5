'use strict';
$(document).ready(function () {
  $('#btnInvia').on('click', async function () {
    let mail = {
      to: $('#txtTo').val(),
      subject: $('#txtSubject').val(),
      message: $('#txtMessage').val()
    };
    let response = await inviaRichiesta('POST', '/api/newMail', mail);
    if (response.status == 200) {
      console.log(response.data);
      alert('Mail inviata correttamente');
    } else alert(response.status + ' : ' + response.err);
  });
});
