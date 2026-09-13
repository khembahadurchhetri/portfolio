
(() => {
  const filters = document.querySelector('.journal-filters'), grid = document.querySelector('.journal-grid');
  if (!filters || !grid) return;
  const previous = document.querySelector('#journal-prev'), next = document.querySelector('#journal-next'), counter = document.querySelector('#journal-page');
  const mobile = matchMedia('(max-width: 768px)');
  let entries = [], category = 'All', page = 0;
  function render() {
    const selected = entries.filter(entry => category === 'All' || entry.category === category);
    const count = mobile.matches ? 1 : 3, pages = Math.max(1, Math.ceil(selected.length / count));
    page = Math.min(page, pages - 1); grid.replaceChildren();
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.textContent === category)));
    for (const entry of selected.slice(page * count, (page + 1) * count)) {
      const card = document.createElement('article'); card.className = 'journal-card';
      const label = document.createElement('span'); label.className='section-kicker'; label.textContent=entry.category + (entry.sample ? ' · Sample' : '');
      const title = document.createElement('h3'); title.textContent=entry.title;
      const text = document.createElement('p'); text.textContent=entry.text;
      const read = document.createElement('a'); read.href='/entry.html?id='+encodeURIComponent(entry.id); read.textContent='Open entry →';
      card.append(label,title,text,read); grid.append(card);
    }
    if (!selected.length) grid.textContent = 'No entries here yet.';
    counter.textContent=`${page + 1} / ${pages}`; previous.disabled=page===0; next.disabled=page===pages-1;
  }
  previous.addEventListener('click',()=>{page--;render();}); next.addEventListener('click',()=>{page++;render();});
  mobile.addEventListener('change',()=>{page=0;render();});
  async function load() {
    try {
      if (window.JournalBackend?.enabled) {
        entries = await window.JournalBackend.request('/api/posts');
      } else {
      const response = await fetch('/api/posts');
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error();
      entries = await response.json();
      }
    } catch {
      if (window.JournalBackend?.enabled) {
        grid.textContent='The journal is being connected. Please check back shortly.';
        previous.disabled=next.disabled=true; return;
      }
      try { const response = await fetch('/assets/journal-samples.json'); if (!response.ok) throw new Error(); entries=await response.json(); document.querySelector('#journal-mode').textContent='Sample preview'; }
      catch { grid.textContent='Start the site with npm start to browse the journal.'; previous.disabled=next.disabled=true; return; }
    }
    for (const name of ['All',...new Set(['Books','Movies','Notes','Photos & videos','Vlogs','Quotes','News',...entries.map(entry=>entry.category)])]) {
      const button=document.createElement('button');button.type='button';button.textContent=name;
      button.addEventListener('click',()=>{category=name;page=0;render();});filters.append(button);
    }
    render();
  }
  load();
})();
