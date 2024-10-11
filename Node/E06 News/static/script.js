const wrapper = document.querySelector('#wrapper');
const divNews = document.querySelector('#news');

showElenco();

async function showElenco() {
  const elencoNotizie = await inviaRichiesta('GET', '/api/elenco');
  if (elencoNotizie) {
    wrapper.innerHTML = '';
    for (const notizia of elencoNotizie) {
      const title = document.createElement('span');
      title.classList.add('titolo');
      title.innerText = notizia.titolo;
      const a = document.createElement('a');
      a.href = '#';
      a.innerText = 'Leggi';
      a.addEventListener('click', () => {
        showDettagli(notizia.file);
      });
      const views = document.createElement('span');
      views.classList.add('nVis');
      views.innerText = `Visualizzato ${notizia.visualizzazioni} volte`;
      const br = document.createElement('br');

      wrapper.appendChild(title);
      wrapper.appendChild(a);
      wrapper.appendChild(views);
      wrapper.appendChild(br);
    }
  }
}

async function showDettagli(file) {
  const dettagli = await inviaRichiesta('POST', '/api/dettagli', { file });
  if (dettagli) {
    divNews.innerText = dettagli.data;

    showElenco();
  }
}
