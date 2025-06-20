function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(`${pageId}-page`).classList.add('active');
  if (pageId === 'home') initCharts();
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const themeBtn = document.querySelector('.theme-toggle');
  themeBtn.innerHTML = document.body.classList.contains('dark-mode')
    ? '<i class="fas fa-sun"></i> TEMA CLARO'
    : '<i class="fas fa-moon"></i> TEMA ESCURO';
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function showToast(message, type = 'info') {
  document.querySelectorAll('.toast').forEach(toast => toast.remove());
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate__animated animate__fadeInUp`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('animate__fadeOut');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
