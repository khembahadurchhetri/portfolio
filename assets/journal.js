// Owner controls: edit entries here and redeploy. Never put private text or URLs
// in this public file. Locked entries must contain only a public title/category.
// Public entry example:
// { category: 'Books', title: 'My reading list', visibility: 'public',
//   text: 'A few recent favourites.', url: 'https://example.com' }
const journalEntries = [
  { category: 'Vlogs', title: 'Stories from the road', visibility: 'soon' },
  { category: 'Books', title: 'On my bookshelf', visibility: 'soon' },
  { category: 'Movies', title: 'After the credits', visibility: 'soon' },
  { category: 'Quotes', title: 'Words to keep', visibility: 'soon' },
  { category: 'Notes', title: 'Personal notes', visibility: 'locked' },
  { category: 'Photos & videos', title: 'Through my lens', visibility: 'soon' },
];
(() => {
  const filters = document.querySelector('.journal-filters');
  const grid = document.querySelector('.journal-grid');
  if (!filters || !grid) return;
  function render(category) {
    grid.replaceChildren();
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.textContent === category)));
    journalEntries.filter(entry => category === 'All' || entry.category === category).forEach(entry => {
      const card = document.createElement('article');
      card.className = 'journal-card';
      const label = document.createElement('span');
      label.className = 'section-kicker';
      label.textContent = entry.category;
      const title = document.createElement('h3');
      title.textContent = entry.title;
      const detail = document.createElement('p');
      detail.textContent = entry.visibility === 'locked' ? 'Locked · A private corner of my journal.' : entry.visibility === 'public' ? entry.text || '' : 'A new chapter, coming soon.';
      card.append(label, title, detail);
      if (entry.visibility === 'public' && entry.url) {
        try {
          const url = new URL(entry.url);
          if (['https:', 'http:'].includes(url.protocol)) {
            const link = document.createElement('a');
            link.href = url.href;
            link.textContent = 'Explore ↗';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            card.append(link);
          }
        } catch { /* Invalid links are not published. */ }
      }
      grid.append(card);
    });
  }
  ['All', ...new Set(journalEntries.map(entry => entry.category))].forEach(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category;
    button.addEventListener('click', () => render(category));
    filters.append(button);
  });
  render('All');
})();
