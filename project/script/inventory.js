let inventories = JSON.parse(localStorage.getItem('inventories')) || [];
let currentSort = { key: null, direction: 'asc' };

document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle').innerHTML = '<i class="fas fa-sun"></i> TEMA CLARO';
  }

  document.getElementById('inventory-form').addEventListener('submit', handleSubmit);
  document.getElementById('search').addEventListener('input', filterItems);

  document.querySelectorAll('th').forEach(header => {
    if (header.textContent.includes('Usuário')) header.addEventListener('click', () => sortTable('usuario'));
    if (header.textContent.includes('Hardware')) header.addEventListener('click', () => sortTable('hardware'));
    if (header.textContent.includes('Setor')) header.addEventListener('click', () => sortTable('setor'));
    if (header.textContent.includes('Data')) header.addEventListener('click', () => sortTable('dataAquisicao'));
  });

  updateStats();
  renderTable();
});

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const newItem = Object.fromEntries(formData.entries());
  newItem.id = Date.now();
  newItem.dateCreated = new Date().toISOString();
  inventories.push(newItem);
  saveToLocalStorage();
  form.reset();
  updateStats();
  renderTable();
  showPage('list');
  showToast('Item cadastrado com sucesso!', 'success');
}

function updateStats() {
  document.getElementById('total-items').textContent = inventories.length;
  document.getElementById('last-item').textContent = inventories.length > 0
    ? new Date(inventories[inventories.length - 1].dateCreated).toLocaleDateString()
    : 'N/A';

  const hardwareTypes = new Set(inventories.map(item => item.hardware));
  document.getElementById('hardware-types').textContent = hardwareTypes.size;
}

function renderTable(items = inventories) {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  if (items.length === 0) {
    document.getElementById('no-items').style.display = 'block';
    document.getElementById('inventory-table').style.display = 'none';
    return;
  }

  document.getElementById('no-items').style.display = 'none';
  document.getElementById('inventory-table').style.display = 'table';

  items.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.usuario}</td>
      <td>${item.hardware}</td>
      <td>${item.setor}</td>
      <td>${item.dataAquisicao}</td>
      <td class="actions">
        <button onclick="editItem(${index})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteItem(${index})"><i class="fas fa-trash"></i></button>
        <button onclick="viewDetails(${index})"><i class="fas fa-eye"></i></button>
      </td>`;
    tbody.appendChild(row);
  });
}

function editItem(index) {
  const item = inventories[index];
  const form = document.getElementById('inventory-form');
  Object.keys(item).forEach(k => form.elements[k] && (form.elements[k].value = item[k]));

  form.onsubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const updated = Object.fromEntries(formData.entries());
    updated.id = item.id;
    updated.dateCreated = item.dateCreated;
    inventories[index] = updated;
    saveToLocalStorage();
    form.reset();
    form.onsubmit = handleSubmit;
    updateStats();
    renderTable();
    showPage('list');
    showToast('Item atualizado com sucesso!', 'success');
  };
  showPage('form');
}

function deleteItem(index) {
  if (confirm('Deseja excluir este item?')) {
    inventories.splice(index, 1);
    saveToLocalStorage();
    renderTable();
    updateStats();
    showToast('Item removido com sucesso!', 'success');
  }
}

function viewDetails(index) {
  const item = inventories[index];
  let details = '';
  for (const [key, value] of Object.entries(item)) {
    if (key !== 'id' && key !== 'dateCreated') {
      details += `${key}: ${value}\n`;
    }
  }
  alert(`Detalhes:\n\n${details}`);
}

function filterItems() {
  const term = document.getElementById('search').value.toLowerCase();
  const filtered = inventories.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(term))
  );
  renderTable(filtered);
}

function sortTable(key) {
  document.querySelectorAll('th i').forEach(i => i.className = 'fas fa-sort');
  const header = [...document.querySelectorAll('th')].find(th => th.textContent.includes(
    key === 'usuario' ? 'Usuário' : key === 'hardware' ? 'Hardware' : key === 'setor' ? 'Setor' : 'Data'
  ));
  header.querySelector('i').className = currentSort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  currentSort.direction = currentSort.key === key && currentSort.direction === 'asc' ? 'desc' : 'asc';
  currentSort.key = key;

  inventories.sort((a, b) => {
    const valA = a[key] || '';
    const valB = b[key] || '';
    return currentSort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  renderTable();
}

function exportToCSV() {
  if (inventories.length === 0) return showToast('Nenhum dado para exportar!', 'error');
  let csv = 'Usuário,Hardware,Software,Suprimento,Setor,Data de Aquisição\n';
  inventories.forEach(i => {
    csv += `"${i.usuario}","${i.hardware}","${i.software}","${i.suprimento}","${i.setor}","${i.dataAquisicao}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `inventario_${new Date().toLocaleDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Exportação concluída!', 'success');
}

function saveToLocalStorage() {
  localStorage.setItem('inventories', JSON.stringify(inventories));
}
