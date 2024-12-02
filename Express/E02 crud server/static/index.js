'use strict';

$(document).ready(function () {
  const divIntestazione = $('#divIntestazione');
  const divFilters = $('.card').eq(0);
  const divCollections = $('#divCollections');
  const table = $('#mainTable');
  const divDettagli = $('#divDettagli');
  const btnAdd = $('#btnAdd');
  let currentCollection = '';

  divFilters.hide();
  $('#lstHair').prop('selectedIndex', -1);

  getCollections();

  async function getCollections() {
    const data = await inviaRichiesta('GET', '/api/getCollections');
    if (data) {
      console.log(data);
      const label = divCollections.children('label');
      for (const collection of data) {
        const clonedLabel = label.clone().appendTo(divCollections);
        clonedLabel.children('span').text(collection.name);
        clonedLabel
          .children('input')
          .val(collection.name)
          .on('click', function () {
            currentCollection = this.value;
            btnAdd.prop('disabled', false);
            getDataCollection();
          });
      }
      label.remove();
    }
  }

  async function getDataCollection() {
    const data = await inviaRichiesta('GET', `/api/${currentCollection}`);
    if (data) {
      console.log(data);
      divIntestazione.find('strong').eq(0).text(currentCollection);
      divIntestazione.find('strong').eq(1).text(data.length);
    }
  }
});
