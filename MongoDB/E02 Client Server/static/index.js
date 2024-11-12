'use strict';

let headers = ['name', 'gender', 'hair', 'weight', 'loves'];

$(document).ready(function () {
  let table = $('table');
  let tbody;
  $('input[type=radio]').on('click', function () {
    const gender = this.value;
    getUnicorns(gender);
  });

  createHeaders();
  getUnicorns('m');

  function createHeaders() {
    let thead = $('<thead>').appendTo(table);
    let tr = $('<tr>').appendTo(thead);
    for (let header of headers) {
      $('<th>').appendTo(tr).text(header);
    }
    tbody = $('<tbody>').appendTo(table);
  }

  async function getUnicorns(gender) {
    const data = await inviaRichiesta('GET', '/api/getUnicorns', { gender });
    if (data) {
      console.log(data);
      tbody.empty();
      data.forEach((unicorn) => {
        const tr = $('<tr>').appendTo(tbody);
        $('<td>').appendTo(tr).text(unicorn.name);
        $('<td>').appendTo(tr).text(unicorn.gender);
        $('<td>').appendTo(tr).text(unicorn.hair);
        $('<td>').appendTo(tr).text(unicorn.weight);
        $('<td>').appendTo(tr).text(unicorn.loves.join(', '));
      });
    }
  }
});
