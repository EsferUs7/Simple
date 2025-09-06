(function initTabs() {
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const panels = {
    python: document.getElementById('tab-python'),
    js: document.getElementById('tab-js'),
    cs: document.getElementById('tab-cs'),
  };

  function activateTab(key) {
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.tab === key;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    Object.entries(panels).forEach(([k, panel]) => {
      const active = k === key;
      panel.hidden = !active;
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  const keyOrder = tabButtons.map(b => b.dataset.tab);
  document.querySelector('.tablist')?.addEventListener('keydown', e => {
    const current = document.activeElement;
    const i = tabButtons.indexOf(current);
    if (i === -1) return;

    let targetIndex = i;
    if (e.key === 'ArrowRight') { targetIndex = (i + 1) % tabButtons.length; }
    else if (e.key === 'ArrowLeft') { targetIndex = (i - 1 + tabButtons.length) % tabButtons.length; }
    else if (e.key === 'Home') { targetIndex = 0; }
    else if (e.key === 'End') { targetIndex = tabButtons.length - 1; }
    else if (e.key === 'Enter' || e.key === ' ') { activateTab(tabButtons[i].dataset.tab); return; }
    else { return; }

    e.preventDefault();
    tabButtons[targetIndex].focus();
  });

  activateTab('python');
})();

(function initButtons() {
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  submitBtn?.addEventListener('click', () => {
    alert("Повідомлення про успіх!");
  });

  cancelBtn?.addEventListener('click', () => {
    alert("Успішно скасовано.");
  });
})();

const data = [
  { id: 1, name: "Яблуко", category: "Фрукти" },
  { id: 2, name: "Банан", category: "Фрукти" },
  { id: 3, name: "Морква", category: "Овочі" },
  { id: 4, name: "Картопля", category: "Овочі" },
  { id: 5, name: "Курка", category: "М'ясо" },
  { id: 6, name: "Яловичина", category: "М'ясо" },
  { id: 7, name: "Молоко", category: "Молочні" },
  { id: 8, name: "Сир", category: "Молочні" },
  { id: 9, name: "Хліб", category: "Зернові" },
  { id: 10, name: "Рис", category: "Зернові" },
];

let currentPage = 1;
const rowsPerPage = 5;
let sortCol = null;
let sortAsc = true;
let searchQuery = "";

const tbody = document.querySelector("#grid tbody");
const searchInput = document.querySelector("#search");
const pageInfo = document.querySelector("#page-info");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");

function renderTable() {
  let filtered = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (sortCol) {
    filtered.sort((a, b) => {
      if (a[sortCol] < b[sortCol]) return sortAsc ? -1 : 1;
      if (a[sortCol] > b[sortCol]) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  const start = (currentPage - 1) * rowsPerPage;
  const pageData = filtered.slice(start, start + rowsPerPage);

  tbody.innerHTML = "";
  for (let row of pageData) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.category}</td>
    `;
    tbody.appendChild(tr);
  }

  pageInfo.textContent = `Сторінка ${currentPage} з ${totalPages || 1}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

searchInput.addEventListener("input", e => {
  searchQuery = e.target.value;
  currentPage = 1;
  renderTable();
});

document.querySelectorAll("#grid th").forEach(th => {
  th.addEventListener("click", () => {
    const col = th.dataset.col;
    if (sortCol === col) {
      sortAsc = !sortAsc;
    } else {
      sortCol = col;
      sortAsc = true;
    }
    renderTable();
  });
});

prevBtn.addEventListener("click", () => {
  currentPage--;
  renderTable();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  renderTable();
});

renderTable();
