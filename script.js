const searchInput = document.querySelector('#gameSearch');
const filters = document.querySelectorAll('.filter');
const cards = [...document.querySelectorAll('.game-card')];
const emptyState = document.querySelector('#emptyState');
const toast = document.querySelector('#toast');
let selectedCategory = 'all';
let toastTimer;

function updateGames() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const matchesSearch = card.dataset.title.toLowerCase().includes(query);
    const show = matchesCategory && matchesSearch;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyState.hidden = visible !== 0;
}

function setFilter(category) {
  selectedCategory = category;
  filters.forEach(button => button.classList.toggle('active', button.dataset.filter === category));
  updateGames();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

searchInput.addEventListener('input', updateGames);
filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));

document.querySelectorAll('[data-filter-jump]').forEach(button => {
  button.addEventListener('click', () => {
    setFilter(button.dataset.filterJump);
    document.querySelector('#trending').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('.play-button').forEach(button => {
  button.addEventListener('click', event => {
    const card = event.currentTarget.closest('.game-card');
    const title = card.dataset.title;
    if (card.dataset.url) {
      window.location.href = card.dataset.url;
      return;
    }
    showToast(`${title} is warming up — game launch coming soon!`);
  });
});

document.querySelector('#surpriseButton').addEventListener('click', () => {
  const pick = cards[Math.floor(Math.random() * cards.length)];
  searchInput.value = '';
  setFilter('all');
  pick.scrollIntoView({ behavior: 'smooth', block: 'center' });
  pick.querySelector('.play-button').focus({ preventScroll: true });
  showToast(`Your surprise pick: ${pick.dataset.title}`);
});

document.querySelector('#themeToggle').addEventListener('click', () => document.body.classList.toggle('light-mode'));

document.querySelector('#menuButton').addEventListener('click', event => {
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  showToast(expanded ? 'Menu closed' : 'Explore the arcade using the sections below.');
});
