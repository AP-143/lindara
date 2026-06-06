// Product Detail + Calculator Page
let currentProduct = null;

async function renderProductDetailPage(path) {
  const id = path.split('/')[2];
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <a href="/">Beranda</a>
          <span class="breadcrumb-sep">›</span>
          <a href="/katalog">Produk</a>
          <span class="breadcrumb-sep">›</span>
          <span id="bc-name">Detail Produk</span>
        </div>
        <h1 class="page-title" id="detail-title">Memuat...</h1>
      </div>
    </div>
    <div class="main-content">
      <div class="container">
        <div style="display:grid;grid-template-columns:1fr 400px;gap:32px;align-items:start" id="detail-layout">
          <div>
            <div class="card" id="product-info-card" style="padding:32px">
              <div class="skeleton" style="height:200px;border-radius:12px"></div>
            </div>
          </div>
          <div>
            <div class="calc-box" id="calc-box">
              <div class="skeleton" style="height:400px;border-radius:12px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderFooter();

  try {
    currentProduct = await apiFetch(`/products/${id}`);
    renderProductInfo(currentProduct);
    renderCalculator(currentProduct);
    document.getElementById('detail-title').textContent = currentProduct.name;
    document.getElementById('bc-name').textContent = currentProduct.name;
  } catch (e) {
    app.innerHTML = `<div class="main-content"><div class="container"><div class="empty-state"><div class="empty-icon">❌</div><div class="empty-title">Produk tidak ditemukan</div><a href="/katalog" class="btn btn-primary">Kembali ke Katalog</a></div></div></div>`;
  }
}

function renderProductInfo(p) {
  const card = document.getElementById('product-info-card');
  if (!card) return;
  card.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
      <div class="product-icon ${categoryClass(p.category)}" style="width:64px;height:64px;font-size:32px">${categoryIcon(p.category)}</div>
      <div>
        <span class="badge ${categoryBadgeClass(p.category)}" style="margin-bottom:8px">${p.category}</span>
        <h2 style="font-size:24px;font-weight:800;color:var(--navy)">${p.name}</h2>
      </div>
    </div>
    <p style="color:var(--text-secondary);line-height:1.8;margin-bottom:28px;font-size:16px">${p.description}</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px">
      <div style="background:var(--bg);border-radius:12px;padding:20px">
        <div style="font-size:12px;color:var(--text-secondary);text-transform:uppercase;font-weight:700;letter-spacing:0.5px;margin-bottom:6px">Premi Dasar</div>
        <div style="font-size:22px;font-weight:800;color:var(--blue-cta);font-family:'Plus Jakarta Sans',sans-serif">${formatRupiah(p.base_premium)}<span style="font-size:13px;color:var(--text-secondary);font-family:Inter,sans-serif;font-weight:400">/bulan</span></div>
      </div>
      <div style="background:var(--bg);border-radius:12px;padding:20px">
        <div style="font-size:12px;color:var(--text-secondary);text-transform:uppercase;font-weight:700;letter-spacing:0.5px;margin-bottom:6px">Maksimal Pertanggungan</div>
        <div style="font-size:22px;font-weight:800;color:var(--mint);font-family:'Plus Jakarta Sans',sans-serif">${formatRupiah(p.coverage_max)}</div>
      </div>
    </div>

    <h3 style="font-size:16px;font-weight:700;color:var(--navy);margin-bottom:16px">Manfaat & Fitur</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${(p.features || []).map(f => `
        <div style="display:flex;align-items:flex-start;gap:10px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:12px">
          <span style="color:var(--mint);font-weight:700;flex-shrink:0">✓</span>
          <span style="font-size:13px;color:var(--text-secondary);line-height:1.5">${f}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCalculator(p) {
  const box = document.getElementById('calc-box');
  if (!box) return;
  box.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:36px;height:36px;background:var(--blue-cta);border-radius:8px;display:flex;align-items:center;justify-content:center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </div>
      <h3 style="font-size:18px;font-weight:700;color:var(--navy)">Kalkulator Premi</h3>
    </div>

    <div class="form-group">
      <label class="form-label">Usia Tertanggung (tahun)</label>
      <input type="number" class="form-input" id="calc-age" placeholder="cth: 30" min="17" max="70">
      <span class="form-hint">Usia 17 - 70 tahun</span>
    </div>
    <div class="form-group">
      <label class="form-label">Nilai Pertanggungan (Rp)</label>
      <div class="input-group">
        <span class="input-prefix">Rp</span>
        <input type="number" class="form-input" id="calc-coverage" placeholder="100.000.000" style="padding-left:48px">
      </div>
      <span class="form-hint">Maks: ${formatRupiah(p.coverage_max)}</span>
    </div>
    <div class="form-group">
      <label class="form-label">Durasi Perlindungan (tahun)</label>
      <select class="form-select" id="calc-duration">
        <option value="1">1 Tahun</option>
        <option value="2">2 Tahun</option>
        <option value="3">3 Tahun</option>
        <option value="5" selected>5 Tahun</option>
        <option value="10">10 Tahun</option>
        <option value="20">20 Tahun</option>
      </select>
    </div>

    <button class="btn btn-primary btn-full" id="calc-btn" onclick="calculatePremium()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
      Hitung Premi
    </button>

    <div id="calc-result" class="hidden"></div>
  `;
}

async function calculatePremium() {
  const age = document.getElementById('calc-age').value;
  const coverage = document.getElementById('calc-coverage').value;
  const duration = document.getElementById('calc-duration').value;
  const btn = document.getElementById('calc-btn');
  const resultDiv = document.getElementById('calc-result');

  if (!age || !coverage) {
    Toast.error('Data tidak lengkap', 'Isi semua field kalkulator');
    return;
  }

  setButtonLoading(btn, true);
  resultDiv.classList.add('hidden');

  try {
    const result = await apiFetch(`/products/${currentProduct.id}/quote`, {
      method: 'POST',
      body: JSON.stringify({ age: parseInt(age), coverage_amount: parseInt(coverage), duration_years: parseInt(duration) })
    });

    resultDiv.classList.remove('hidden');
    resultDiv.innerHTML = `
      <div class="calc-result mt-4">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-bottom:4px">Estimasi Premi Anda</div>
          <div style="font-size:40px;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif;color:#60A5FA">${formatRupiah(result.monthly_premium)}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.7)">/bulan</div>
        </div>
        <div class="calc-result-row">
          <span class="calc-result-label">Premi Tahunan</span>
          <span class="calc-result-value">${formatRupiah(result.annual_premium)}</span>
        </div>
        <div class="calc-result-row">
          <span class="calc-result-label">Total ${result.duration_years} Tahun</span>
          <span class="calc-result-value">${formatRupiah(result.total_premium)}</span>
        </div>
        <div class="calc-result-row">
          <span class="calc-result-label">Nilai Pertanggungan</span>
          <span class="calc-result-value">${formatRupiah(result.coverage_amount)}</span>
        </div>
      </div>
      <div style="margin-top:16px">
        ${Auth.isLoggedIn() ? `
          <button class="btn btn-mint btn-full" onclick="openBuyModal()">
            🛡️ Beli Polis Sekarang
          </button>
        ` : `
          <a href="/login" class="btn btn-mint btn-full">
            Masuk untuk Membeli
          </a>
        `}
        <p style="text-align:center;font-size:12px;color:var(--text-secondary);margin-top:10px">* Estimasi. Premi final dapat berbeda.</p>
      </div>
    `;
  } catch (e) {
    Toast.error('Gagal menghitung', e.message);
  } finally {
    setButtonLoading(btn, false);
  }
}

function openBuyModal() {
  const coverageVal = document.getElementById('calc-coverage')?.value || '';
  const duration = document.getElementById('calc-duration')?.value || '1';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'buy-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Beli Polis — ${currentProduct?.name}</h3>
        <button class="modal-close" onclick="document.getElementById('buy-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div style="background:var(--bg);border-radius:12px;padding:16px;margin-bottom:20px;display:flex;align-items:center;gap:12px">
          <span style="font-size:28px">${categoryIcon(currentProduct?.category)}</span>
          <div>
            <div style="font-weight:700;color:var(--navy)">${currentProduct?.name}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${currentProduct?.category}</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Tertanggung *</label>
          <input type="text" class="form-input" id="buy-insured-name" placeholder="Nama lengkap sesuai KTP">
        </div>
        <div class="form-group">
          <label class="form-label">Nilai Pertanggungan (Rp) *</label>
          <input type="number" class="form-input" id="buy-coverage" value="${coverageVal}" placeholder="100000000">
        </div>
        <div class="form-group">
          <label class="form-label">Durasi Perlindungan</label>
          <select class="form-select" id="buy-duration">
            <option value="1">1 Tahun</option>
            <option value="2">2 Tahun</option>
            <option value="3">3 Tahun</option>
            <option value="5" ${duration == 5 ? 'selected' : ''}>5 Tahun</option>
            <option value="10">10 Tahun</option>
          </select>
        </div>
        <div id="buy-error" class="hidden" style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px;font-size:14px;color:var(--error);margin-bottom:16px"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.getElementById('buy-modal').remove()">Batal</button>
        <button class="btn btn-primary" id="buy-submit-btn" onclick="submitBuyPolicy()">
          🛡️ Aktifkan Polis
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
}

async function submitBuyPolicy() {
  const insuredName = document.getElementById('buy-insured-name').value.trim();
  const coverage = document.getElementById('buy-coverage').value;
  const duration = document.getElementById('buy-duration').value;
  const btn = document.getElementById('buy-submit-btn');
  const errDiv = document.getElementById('buy-error');

  errDiv.classList.add('hidden');

  if (!insuredName) { errDiv.textContent = 'Nama tertanggung wajib diisi'; errDiv.classList.remove('hidden'); return; }
  if (!coverage || parseInt(coverage) < 1000000) { errDiv.textContent = 'Nilai pertanggungan minimal Rp 1.000.000'; errDiv.classList.remove('hidden'); return; }

  setButtonLoading(btn, true);
  try {
    const policy = await apiFetch('/policies', {
      method: 'POST',
      body: JSON.stringify({
        product_id: currentProduct.id,
        insured_name: insuredName,
        coverage_amount: parseInt(coverage),
        duration_years: parseInt(duration)
      })
    });

    document.getElementById('buy-modal').remove();
    Toast.success('Polis berhasil dibuat!', `Nomor polis: ${policy.policy_number}`);
    setTimeout(() => Router.navigate('/dashboard'), 1500);
  } catch (e) {
    errDiv.textContent = e.message;
    errDiv.classList.remove('hidden');
    setButtonLoading(btn, false);
  }
}
