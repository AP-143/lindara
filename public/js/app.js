// ============================
// LINDARA - Core App Utilities
// ============================

const API = '/api';

// Auth helpers
const Auth = {
  getToken: () => localStorage.getItem('lindara_token'),
  getUser: () => { try { return JSON.parse(localStorage.getItem('lindara_user')); } catch { return null; } },
  setSession: (token, user) => {
    localStorage.setItem('lindara_token', token);
    localStorage.setItem('lindara_user', JSON.stringify(user));
  },
  clearSession: () => {
    localStorage.removeItem('lindara_token');
    localStorage.removeItem('lindara_user');
  },
  isLoggedIn: () => !!localStorage.getItem('lindara_token'),
  isAdmin: () => { const u = Auth.getUser(); return u && u.role === 'admin'; }
};

// HTTP helpers
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { status: res.status, message: data.error || 'Terjadi kesalahan' };
  }
  return data;
}

// Toast notifications
const Toast = {
  container: null,
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(title, message, type = 'info', duration = 4000) {
    this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>
    `;
    this.container.appendChild(toast);
    if (duration > 0) setTimeout(() => toast.remove(), duration);
  },
  success: (t, m) => Toast.show(t, m, 'success'),
  error: (t, m) => Toast.show(t, m, 'error'),
  warning: (t, m) => Toast.show(t, m, 'warning'),
  info: (t, m) => Toast.show(t, m, 'info')
};

// Format currency
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

// Format date
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Status badge HTML
function statusBadge(status) {
  const map = {
    active: ['badge-success', '● Aktif'],
    expired: ['badge-gray', '● Kadaluarsa'],
    cancelled: ['badge-error', '● Dibatalkan'],
    pending: ['badge-warning', '⏳ Pending'],
    approved: ['badge-success', '✓ Disetujui'],
    rejected: ['badge-error', '✕ Ditolak'],
  };
  const [cls, label] = map[status] || ['badge-gray', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// Category icon
function categoryIcon(cat) {
  const icons = { 'Jiwa': '💙', 'Kesehatan': '🏥', 'Kendaraan': '🚗', 'Properti': '🏠' };
  return icons[cat] || '🛡️';
}
function categoryClass(cat) {
  const map = { 'Jiwa': 'jiwa', 'Kesehatan': 'kesehatan', 'Kendaraan': 'kendaraan', 'Properti': 'properti' };
  return map[cat] || '';
}
function categoryBadgeClass(cat) {
  const map = { 'Jiwa': 'badge-jiwa', 'Kesehatan': 'badge-kesehatan', 'Kendaraan': 'badge-kendaraan', 'Properti': 'badge-properti' };
  return map[cat] || 'badge-info';
}

// Show/hide loading spinner in button
function setButtonLoading(btn, loading) {
  if (loading) {
    btn.dataset.origText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> Memproses...`;
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.origText || btn.innerHTML;
    btn.disabled = false;
  }
}

// Skeleton loader
function skeletonCards(count = 4) {
  return Array(count).fill(0).map(() => `
    <div class="card">
      <div class="card-body">
        <div class="skeleton" style="height:56px;width:56px;border-radius:12px;margin-bottom:16px"></div>
        <div class="skeleton" style="height:20px;width:70%;margin-bottom:10px"></div>
        <div class="skeleton" style="height:14px;width:100%;margin-bottom:6px"></div>
        <div class="skeleton" style="height:14px;width:80%;margin-bottom:20px"></div>
        <div class="skeleton" style="height:36px;width:100%"></div>
      </div>
    </div>
  `).join('');
}

// Navbar rendering
function renderNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const user = Auth.getUser();
  const isLoggedIn = Auth.isLoggedIn();

  nav.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-inner">
          <a href="/" class="navbar-brand">
            <div class="navbar-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="navbar-brand-text">
              <span class="navbar-brand-name">Lindara</span>
              <span class="navbar-brand-tagline">Lindungi yang Berharga.</span>
            </div>
          </a>

          <nav class="navbar-nav">
            <a href="/" class="nav-link" data-page="home">Beranda</a>
            <a href="/katalog" class="nav-link" data-page="katalog">Produk</a>
            ${isLoggedIn && !Auth.isAdmin() ? `<a href="/dashboard" class="nav-link" data-page="dashboard">Dashboard</a>` : ''}
            ${isLoggedIn && !Auth.isAdmin() ? `<a href="/klaim" class="nav-link" data-page="klaim">Klaim</a>` : ''}
            ${Auth.isAdmin() ? `<a href="/admin" class="nav-link" data-page="admin">Admin Panel</a>` : ''}
          </nav>

          <div class="navbar-actions">
            ${isLoggedIn ? `
              <div class="navbar-user">
                <div class="user-avatar">${user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                <span class="hidden" id="user-name-nav" style="color:rgba(255,255,255,0.85);font-size:14px">${user?.name?.split(' ')[0] || ''}</span>
              </div>
              <button class="btn btn-outline-white btn-sm" onclick="handleLogout()">Keluar</button>
            ` : `
              <a href="/login" class="btn btn-outline-white btn-sm">Masuk</a>
              <a href="/register" class="btn btn-primary btn-sm">Daftar Gratis</a>
            `}
          </div>
          <button class="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu">
        <a href="/" class="nav-link">Beranda</a>
        <a href="/katalog" class="nav-link">Produk</a>
        ${isLoggedIn && !Auth.isAdmin() ? `<a href="/dashboard" class="nav-link">Dashboard</a><a href="/klaim" class="nav-link">Klaim</a>` : ''}
        ${Auth.isAdmin() ? `<a href="/admin" class="nav-link">Admin Panel</a>` : ''}
        ${isLoggedIn ? `<a href="#" class="nav-link" onclick="handleLogout()">Keluar</a>` : `<a href="/login" class="nav-link">Masuk</a><a href="/register" class="nav-link">Daftar</a>`}
      </div>
    </nav>
  `;
  highlightActiveNav();
}

function highlightActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const page = link.dataset.page;
    if (page === 'home' && path === '/') link.classList.add('active');
    else if (page !== 'home' && path.startsWith('/' + page)) link.classList.add('active');
  });
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('open');
}

function handleLogout() {
  Auth.clearSession();
  Toast.success('Berhasil keluar', 'Sampai jumpa kembali!');
  setTimeout(() => window.location.href = '/', 800);
}

// SPA Router
const Router = {
  routes: {},
  register(path, handler) { this.routes[path] = handler; },
  async navigate(path) {
    window.history.pushState({}, '', path);
    await this.handle(path);
  },
  async handle(path) {
    const clean = path.split('?')[0];
    const handler = this.routes[clean] || this.routes['*'];
    if (handler) await handler(path);
  },
  init() {
    window.addEventListener('popstate', () => this.handle(window.location.pathname));
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
      e.preventDefault();
      this.navigate(href);
    });
  }
};

// Protect routes that need auth
function requireAuth(role = null) {
  if (!Auth.isLoggedIn()) { Router.navigate('/login'); return false; }
  if (role === 'admin' && !Auth.isAdmin()) { Router.navigate('/'); return false; }
  if (role === 'customer' && Auth.isAdmin()) { Router.navigate('/admin'); return false; }
  return true;
}

// Init on load
window.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
});
