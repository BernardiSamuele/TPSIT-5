const lstClasses = document.querySelector('#lstClasses');
const btnFind = document.querySelector('#btnFind');
const tbodyStudenti = document.querySelector('#tbodyStudenti');
const tableStudenti = document.querySelector('#tableStudenti');
const details = document.querySelector('#details');
const card = document.querySelector('.card:nth-of-type(3)');
const checkboxMale = document.querySelector('#chkMale');
const checkboxFemale = document.querySelector('#chkFemale');

caricaClassi();
btnFind.addEventListener('click', caricaStudenti);

async function caricaClassi() {
  lstClasses.innerHTML = '';
  const classi = await inviaRichiesta('GET', '/api/classi');
  if (classi) {
    console.log(classi);
    for (const classe of classi) {
      const option = document.createElement('option');
      option.textContent = classe;
      lstClasses.appendChild(option);
    }

    lstClasses.selectedIndex = -1;
  }
}

async function caricaStudenti() {
  const classe = lstClasses.value;
  if (!classe) {
    alert('Selezionare una classe');
    return;
  }
  let genere = [];
  if (checkboxMale.checked) {
    genere.push('m');
  }
  if (checkboxFemale.checked) {
    genere.push('f');
  }
  if (genere.length === 0) {
    alert('Selezionare almeno un genere');
    return;
  }
  const studenti = await inviaRichiesta('GET', '/api/studenti', { classe, genere });
  if (studenti) {
    console.log(studenti);
    tbodyStudenti.innerHTML = '';

    for (const studente of studenti) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = studente.nome;
      td.idStudente = studente._id;
      td.addEventListener('click', mostraDettagli);
      tr.appendChild(td);
      for (const valutazione of studente.valutazioni) {
        const td = document.createElement('td');
        td.textContent = valutazione.voto;
        tr.appendChild(td);
      }
      tbodyStudenti.appendChild(tr);
    }
    tableStudenti.style.display = 'block';
  }
}

async function mostraDettagli() {
  const id = this.idStudente;
  const dettagli = await inviaRichiesta('GET', '/api/dettagli', { id });
  if (dettagli) {
    console.log(dettagli);
    details.innerHTML = '';
    const nome = document.createElement('p');
    nome.innerHTML = `nome: ${dettagli.nome}`;
    const classe = document.createElement('p');
    classe.innerHTML = `classe: ${dettagli.classe}`;
    const assenze = document.createElement('p');
    assenze.innerHTML = `assenze: ${dettagli.assenze}`;
    const dob = document.createElement('p');
    dob.innerHTML = `data di nascita: ${new Date(dettagli.dob).toLocaleDateString()}`;
    details.append(nome, classe, assenze, dob);
    card.style.display = 'block';
  }
}
