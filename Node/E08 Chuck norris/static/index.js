const lstCategories = document.querySelector('#lstCategories');
const factsContainer = document.querySelector('#factsContainer');
const btnLike = document.querySelector('#btnInvia');
const txtNewFact = document.querySelector('#newFact');
const btnAddFact = document.querySelector('#btnAdd');

lstCategories.addEventListener('change', function () {
  getFacts(this.value);
});
btnLike.addEventListener('click', addLikes);
btnAddFact.addEventListener('click', addFact);
getCategories();

async function getCategories() {
  const categories = await inviaRichiesta('GET', '/api/categories');
  if (categories) {
    loadCategories(categories);
  }
}

function loadCategories(categories) {
  for (const category of categories) {
    const option = document.createElement('option');
    option.text = category;
    lstCategories.appendChild(option);
  }
  lstCategories.dispatchEvent(new Event('change'));
}

async function getFacts(category) {
  const facts = await inviaRichiesta('GET', '/api/facts', { category });
  if (facts) {
    loadFacts(facts);
  }
}
function loadFacts(facts) {
  factsContainer.innerHTML = '';
  for (const fact of facts) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = fact.id;

    const span = document.createElement('span');
    span.textContent = fact.value;

    factsContainer.append(input, span, document.createElement('br'));
  }
}

async function addLikes() {
  const checkboxes = document.querySelectorAll('input[type=checkbox]');
  console.log(checkboxes);
  const likedFacts = [...checkboxes].map((checkbox) => checkbox.value);

  const response = await inviaRichiesta('POST', '/api/rate', { likedFacts });
  if (response) {
    getFacts(lstCategories.value);
  }
}

async function addFact() {
  const value = txtNewFact.value;
  const category = lstCategories.value;
  const response = await inviaRichiesta('POST', '/api/addFact', { value, category });
  if (response) {
    getFacts(lstCategories.value);
    alert('Fact added successfully');
  }
}
