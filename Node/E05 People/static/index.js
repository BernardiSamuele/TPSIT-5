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
    people = await inviaRichiesta('GET', '/api/people', { country: selectedCountry });
    if (people) {
      console.log(people);
      tabStudenti.empty();
      divDettagli.hide();
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
                currentPos = findIndex(p.name);
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
    const person = await inviaRichiesta('GET', '/api/getDetails', { pName });
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
      const selectedCountry = $('#dropdownMenuButton').text();
      showPeople(selectedCountry);
    }
  }

  // divDettagli.find('a').get(0).on('click', function(){})
  divDettagli
    .get(0)
    .querySelectorAll('a')[0]
    .addEventListener('click', function () {
      currentPos = 0;
      showDetails(people[currentPos].name);
    });
  divDettagli
    .get(0)
    .querySelectorAll('a')[1]
    .addEventListener('click', function () {
      if (currentPos > 0) {
        currentPos--;
      }
      showDetails(people[currentPos].name);
    });
  divDettagli
    .get(0)
    .querySelectorAll('a')[2]
    .addEventListener('click', function () {
      if (currentPos < people.length - 1) {
        currentPos++;
      }
      showDetails(people[currentPos].name);
    });
  divDettagli
    .get(0)
    .querySelectorAll('a')[3]
    .addEventListener('click', function () {
      currentPos = people.length - 1;
      showDetails(people[currentPos].name);
    });

  // Ritorna l'indice della persona corrente all'interno del vettore people
  function findIndex(pName) {
    return people.findIndex(function (p) {
      return JSON.stringify(p.name) == JSON.stringify(pName);
    });
  }
};
