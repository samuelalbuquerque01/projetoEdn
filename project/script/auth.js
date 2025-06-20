let currentUser = null;

const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" }
];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-modal').style.display = 'block';

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      currentUser = user;
      document.getElementById('login-modal').style.display = 'none';
      showPage('home');
      showToast(`Bem-vindo, ${user.username}!`, 'success');

      if (user.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
      }
    } else {
      showToast('Credenciais inválidas!', 'error');
    }
  });
});
