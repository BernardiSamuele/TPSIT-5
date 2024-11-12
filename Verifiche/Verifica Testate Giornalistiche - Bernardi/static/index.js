'use strict';

let headers = ['testata', 'giornalista', 'areaInteresse'];
let width = [180, 180, 160];

window.onload = function () {
  const lstTestateItaliane = document.querySelector('#lstTestateItaliane');
  const lstTestateStraniere = document.querySelector('#lstTestateStraniere');
  const divAreeInteresseContainer = document.querySelector('#divAreeInteresseContainer');
  const divDettagli = document.querySelector('#divDettagli');

  getTestateItaliane();

  async function getTestateItaliane() {
    const testate = await inviaRichiesta('GET', '/api/testate');
    if (testate) {
      console.log(testate);
      loadTestate(lstTestateItaliane, testate.italiane);
      loadTestate(lstTestateStraniere, testate.straniere);
      loadAreeInteresse(testate.areeInteresse);
    }
  }

  function loadTestate(listBox, testate) {
    listBox.innerHTML = '';
    testate.forEach((testata) => {
      const option = document.createElement('option');
      option.text = testata;
      listBox.appendChild(option);
    });
    listBox.selectedIndex = -1;
    listBox.addEventListener('change', showDetails);
  }

  function loadAreeInteresse(areeInteresse) {
    divAreeInteresseContainer.innerHTML = '';
    areeInteresse.forEach((area) => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = area;
      input.addEventListener('click', areaInteresseClicked);
      const span = document.createElement('span');
      span.textContent = area;

      divAreeInteresseContainer.append(input, span, document.createElement('br'));
    });
  }

  async function showDetails() {
    // Evita che si generi una ricorsione infinita tra i 2 eventi
    if (this.selectedIndex < 0) {
      return;
    }
    const checkboxes = divAreeInteresseContainer.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    if (this === lstTestateItaliane) {
      lstTestateStraniere.selectedIndex = -1;
    } else {
      lstTestateItaliane.selectedIndex = -1;
    }

    const dettagli = await inviaRichiesta('GET', '/api/dettagli', { testata: this.value });
    if (dettagli) {
      console.log(dettagli);
      divDettagli.innerHTML = '';
      const img = document.createElement('img');
      img.src = `img/${dettagli.immagine}`;
      img.addEventListener('error', function () {
        this.src = 'img/writer.png';
      });

      const div = document.createElement('div');

      const testata = document.createElement('p');
      testata.innerHTML = `<b>${dettagli.testata}</b>`;

      const direttore = document.createElement('p');
      direttore.innerHTML = `Direttore: <b>${dettagli.direttore}</b>`;

      const sede = document.createElement('sede');
      sede.innerHTML = `Sede: <b>${dettagli.sede}</b>`;

      const giornalisti = document.createElement('p');
      giornalisti.innerHTML = `Principali giornalisti: <b>${dettagli.giornalisti.map((giornalista) => giornalista.nome).join(', ')}</b>`;

      div.append(testata, direttore, sede, giornalisti);
      divDettagli.append(img, div);
      divDettagli.style.display = 'flex';
    }
  }

  async function areaInteresseClicked() {
    const checkboxes = divAreeInteresseContainer.querySelectorAll('input[type=checkbox]');
    const selectedCheckboxes = [...checkboxes].filter((checkbox) => checkbox.checked);
    const selectedAreas = selectedCheckboxes.map((checkbox) => checkbox.value);
    console.log(selectedAreas);

    if (selectedAreas.length === 0) {
      divDettagli.innerHTML = '';
      divDettagli.style.display = '';
      return;
    }

    lstTestateItaliane.selectedIndex = -1;
    lstTestateStraniere.selectedIndex = -1;

    const giornalisti = await inviaRichiesta('POST', '/api/giornalisti', { aree: selectedAreas });
    if (giornalisti) {
      loadGiornalisti(giornalisti);
      console.log(giornalisti);
    }
  }

  function loadGiornalisti(giornalisti) {
    divDettagli.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    const thTestata = document.createElement('th');
    thTestata.textContent = 'Testata';

    const thGiornalista = document.createElement('th');
    thGiornalista.textContent = 'Giornalista';

    const thAree = document.createElement('th');
    thAree.textContent = 'Aree di interesse';

    tr.append(thTestata, thGiornalista, thAree);
    thead.appendChild(tr);

    const tbody = document.createElement('tbody');
    giornalisti.forEach((giornalista) => {
      const tr = document.createElement('tr');
      const tdTestata = document.createElement('td');
      tdTestata.textContent = giornalista.testata;

      const tdNome = document.createElement('td');
      tdNome.textContent = giornalista.nome;

      const tdArea = document.createElement('td');
      tdArea.textContent = giornalista.area_di_interesse;

      tr.append(tdTestata, tdNome, tdArea);
      tbody.appendChild(tr);
    });

    table.append(thead, tbody);
    divDettagli.append(table);
    divDettagli.style.display = 'flex';
  }
};
