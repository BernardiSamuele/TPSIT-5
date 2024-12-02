'use strict';

const optContainer = document.querySelector('.optContainer');
const detailsContainer = document.querySelector('.detailsContainer');
detailsContainer.style.display = 'none';

caricaScuderie();

async function caricaScuderie() {
  optContainer.innerHTML = '';
  const scuderie = await inviaRichiesta('GET', '/api/scuderie');
  if (scuderie) {
    for (const scuderia of scuderie) {
      const label = document.createElement('label');
      label.classList.add('form-check-label');
      const input = document.createElement('input');
      input.classList.add('form-check-input');
      input.type = 'radio';
      input.value = scuderia._id;
      input.name = 'optScuderia';
      input.addEventListener('click', caricaPiloti);
      const span = document.createElement('span');
      span.textContent = scuderia.scuderia;
      label.append(input, span);
      optContainer.appendChild(label);
    }
  }
}

async function caricaPiloti() {
  detailsContainer.style.display = '';
  detailsContainer.innerHTML = '';
  const id = this.value;
  const piloti = await inviaRichiesta('GET', '/api/piloti', { id });
  if (piloti) {
    console.log('Piloti:', piloti);
    for (const pilota of piloti) {
      const card = document.createElement('div');
      card.classList.add('card');
      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-header', 'bg-secondary', 'text-white', 'font-weight-bold');
      cardHeader.textContent = pilota.nome;
      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      const img = document.createElement('img');
      img.src = `img/${pilota.nome.replace(' ', '-')}.jpg`;
      card.append(cardHeader, cardBody, img);
      detailsContainer.appendChild(card);
    }
  }
}
