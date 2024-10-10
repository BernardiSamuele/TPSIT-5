'use strict';

let currentCountry; // nazione attualmente selezionata

// vettore enumerativo delle Persone attualmente visualizzate
// Comodo per gestire i pulsanti di navigazione
let people;
// Posizione del dettaglio corrente (rispetto al vettore enumerativo people)
let currentPos;

window.onload = async function () {
  const lstNazioni = $('#lstNazioni');
  const tabStudenti = $('#tabStudenti');
  const divDettagli = $('#divDettagli');

  divDettagli.hide();

  let countries = await inviaRichiesta('GET', '/api/country');
  if (countries) {
    console.log(countries);

    for (const country of countries) {
      $('<a>')
        .addClass('dropdown-item')
        .prop('href', '#')
        .text(country)
        .appendTo(lstNazioni)
        .on('click', function () {
          // const selectedCountry = $(this).text();
          const selectedCountry = this.textContent;
          $(this).parent().parent().children('button').text(selectedCountry);
          showPeople(selectedCountry);
        });
    }
  }

  async function showPeople(selectedCountry) {
    const people = await inviaRichiesta('GET', '/api/people', { country: selectedCountry });
    if (people) {
      console.log(people);
      tabStudenti.empty();
      people.forEach((p) => {
        let tr = $('<tr>').appendTo(tabStudenti);
        $('<td>').appendTo(tr).text(`${p.name.title} ${p.name.first} ${p.name.last}`);
        $('<td>').appendTo(tr).text(p.location.city);
        $('<td>').appendTo(tr).text(p.location.state);
        $('<td>').appendTo(tr).text(p.cell);
        $('<td>')
          .appendTo(tr)
          .append(
            $('<button>')
              .text('Dettagli')
              .on('click', function () {
                showDetails(p.name);
              })
          );
        $('<td>')
          .appendTo(tr)
          .append(
            $('<button>')
              .text('Elimina')
              .on('click', function () {
                deletePerson(p.name);
              })
          );
      });
    }
  }

  async function showDetails(pName) {
    const person = await inviaRichiesta('GET', '/api/getDetails', pName);
    if (person) {
      console.log(person);
      divDettagli.show();
      const img = divDettagli.find('.card-img-top');
      const title = divDettagli.find('.card-title');
      const text = divDettagli.find('.card-text');

      img.prop('src', person.picture.large);
      title.text(`${person.name.title} ${person.name.first} ${person.name.last}`);
      text.html(`<b>Address:</b> ${JSON.stringify(person.location)}`);
    }
  }

  async function deletePerson(pName) {
    const data = await inviaRichiesta('DELETE', '/api/deletePerson', { pName });
    if (data) {
      console.log(data);
      alert('Utente eliminato correttamente');
      lstNazioni.trigger('click');
    }
  }
};
