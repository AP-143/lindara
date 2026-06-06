// Katalog / Product List Page
let allProducts = [];
let activeCategory = 'Semua';

async function renderKatalogPage(path) {
  const urlParams = new URLSearchParams(path.split('?')[1] || '');
  const initCat = urlParams.get('cat') || 'Semua';

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <a href="/">Beranda</a>
          <span class="breadcrumb-sep">›</span>
          <span>Produk Asuransi</span>
        </div>
        <h1 class="page-title">Katalog Produk Asuransi</h1>
        <p class="page-subtitle">Temukan produk perlindungan terbaik yang sesuai dengan kebutuhan Anda</p>
      </div>
    </div>
    <div class="main-content" style="background:var(--bg)">
      <div class="container">
        <div class="filter-bar" id="filter-bar">
          <button class="filter-btn active" data-cat="Semua" onclick="filterProducts('Semua', this)">Semua Produk</button>
          <button class="filter-btn" data-cat="Jiwa" onclick="filterProducts('Jiwa', this)">💙 Jiwa</button>
          <button class="filter-btn" data-cat="Kesehatan" onclick="filterProducts('Kesehatan', this)">🏥 Kesehatan</button>
          <button class="filter-btn" data-cat="Kendaraan" onclick="filterProducts('Kendaraan', this)">🚗 Kendaraan</button>
          <button class="filter-btn" data-cat="Properti" onclick="filterProducts('Properti', this)">🏠 Properti</button>
        </div>
        <div class="grid-3" id="products-grid">
          ${skeletonCards(6)}
        </div>
      </div>
    </div>
  `;

  renderFooter();

  try {
    allProducts = await apiFetch('/products');
    if (initCat !== 'Semua') {
      const btn = document.querySelector(`[data-cat="${initCat}"]`);
      if (btn) filterProducts(initCat, btn);
    } else {
      renderProducts(allProducts);
    }
  } catch (e) {
    document.getElementById('products-grid').innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚠️</div><div class="empty-title">Gagal memuat produk</div><div class="empty-desc">${e.message}</div></div>`;
  }
}

function filterProducts(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const filtered = cat === 'Semua' ? allProducts : allProducts.filter(p => p.category === cat);
  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  if (!products.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><div class="empty-title">Tidak ada produk ditemukan</div><div class="empty-desc">Coba kategori lain</div></div>`;
    return;
  }
  grid.innerHTML = products.map(p => productCardHTML(p)).join('');
}
