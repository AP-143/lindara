// Admin Panel
let adminCurrentTab = 'claims';

async function renderAdminPage() {
  if (!requireAuth('admin')) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-layout">
      <div class="admin-sidebar">
        <div style="padding:20px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:12px">
          <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:800;color:white">Admin Panel</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px">Lindara Management</div>
        </div>
        <div class="sidebar-section-label">Menu</div>
        <button class="sidebar-link active" id="sidebar-claims" onclick="adminShowTab('claims')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Klaim Masuk
          <span id="pending-badge" style="margin-left:auto;background:var(--error);color:white;font-size:11px;padding:2px 7px;border-radius:100px"></span>
        </button>
        <button class="sidebar-link" id="sidebar-products" onclick="adminShowTab('products')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Produk
        </button>
        <button class="sidebar-link" id="sidebar-policies" onclick="adminShowTab('policies')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/></svg>
          Semua Polis
        </button>
        <div class="sidebar-section-label" style="margin-top:16px">Akun</div>
        <button class="sidebar-link" onclick="handleLogout()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Keluar
        </button>
      </div>
      <div class="admin-main">
        <div id="admin-content">
          <div class="skeleton" style="height:400px;border-radius:12px"></div>
        </div>
      </div>
    </div>
  `;

  adminShowTab('claims');
}

function adminShowTab(tab) {
  adminCurrentTab = tab;
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const active = document.getElementById(`sidebar-${tab}`);
  if (active) active.classList.add('active');

  if (tab === 'claims') adminLoadClaims();
  else if (tab === 'products') adminLoadProducts();
  else if (tab === 'policies') adminLoadPolicies();
}

async function adminLoadClaims() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="skeleton" style="height:400px;border-radius:12px"></div>`;

  try {
    const claims = await apiFetch('/claims');
    const pending = claims.filter(c => c.status === 'pending');
    const badge = document.getElementById('pending-badge');
    if (badge) badge.textContent = pending.length > 0 ? pending.length : '';

    content.innerHTML = `
      <div class="flex-between mb-6">
        <div>
          <h2 style="font-size:22px;font-weight:800;color:var(--navy)">Manajemen Klaim</h2>
          <p style="color:var(--text-secondary);font-size:14px;margin-top:4px">${claims.length} total klaim, ${pending.length} menunggu</p>
        </div>
      </div>

      <div class="tabs">
        <button class="tab-btn active" onclick="adminFilterClaims('all', this)">Semua (${claims.length})</button>
        <button class="tab-btn" onclick="adminFilterClaims('pending', this)">Pending (${pending.length})</button>
        <button class="tab-btn" onclick="adminFilterClaims('approved', this)">Disetujui</button>
        <button class="tab-btn" onclick="adminFilterClaims('rejected', this)">Ditolak</button>
      </div>

      <div id="claims-table">
        ${renderClaimsTable(claims)}
      </div>
    `;
    window._allAdminClaims = claims;
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Gagal memuat klaim</div></div>`;
  }
}

function adminFilterClaims(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const claims = window._allAdminClaims || [];
  const filtered = status === 'all' ? claims : claims.filter(c => c.status === status);
  document.getElementById('claims-table').innerHTML = renderClaimsTable(filtered);
}

function renderClaimsTable(claims) {
  if (!claims.length) return `<div class="empty-state"><div class="empty-icon">📝</div><div class="empty-title">Tidak ada klaim</div></div>`;
  return `
    <div class="table-wrapper">
      <table>
        <thead><tr>
          <th>Nasabah</th>
          <th>Produk / Polis</th>
          <th>Jumlah</th>
          <th>Alasan</th>
          <th>Status</th>
          <th>Tanggal</th>
          <th>Aksi</th>
        </tr></thead>
        <tbody>
          ${claims.map(c => `
            <tr id="claim-row-${c.id}">
              <td>
                <div style="font-weight:600">${c.user_name}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${c.user_email}</div>
              </td>
              <td>
                <div style="font-weight:600;font-size:13px">${c.product_name}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${c.policy_number}</div>
              </td>
              <td><strong style="color:var(--blue-cta)">${formatRupiah(c.amount)}</strong></td>
              <td style="max-width:180px;font-size:13px;color:var(--text-secondary)">${c.reason.substring(0, 80)}${c.reason.length > 80 ? '...' : ''}</td>
              <td>
                ${statusBadge(c.status)}
                ${c.admin_note ? `<div style="font-size:11px;color:var(--text-secondary);margin-top:2px">${c.admin_note}</div>` : ''}
              </td>
              <td style="font-size:13px;color:var(--text-secondary)">${formatDate(c.created_at)}</td>
              <td>
                ${c.status === 'pending' ? `
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-mint btn-sm" onclick="adminProcessClaim(${c.id}, 'approved')">✓ Setujui</button>
                    <button class="btn btn-danger btn-sm" onclick="adminProcessClaim(${c.id}, 'rejected')">✕ Tolak</button>
                  </div>
                ` : '<span style="font-size:13px;color:var(--text-secondary)">—</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function adminProcessClaim(id, status) {
  const note = status === 'rejected' ? prompt('Alasan penolakan (opsional):') : null;
  if (status === 'rejected' && note === null) return; // user cancelled

  try {
    const updated = await apiFetch(`/claims/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_note: note || null })
    });
    Toast.success(
      status === 'approved' ? 'Klaim disetujui!' : 'Klaim ditolak',
      `Klaim #${id} telah diperbarui`
    );
    adminLoadClaims();
  } catch (e) {
    Toast.error('Gagal memproses', e.message);
  }
}

async function adminLoadProducts() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="skeleton" style="height:400px;border-radius:12px"></div>`;

  try {
    const res = await fetch('/api/products?_all=1');
    const products = await apiFetch('/products?_show_all=1');

    content.innerHTML = `
      <div class="flex-between mb-6">
        <div>
          <h2 style="font-size:22px;font-weight:800;color:var(--navy)">Manajemen Produk</h2>
          <p style="color:var(--text-secondary);font-size:14px;margin-top:4px">${products.length} produk aktif</p>
        </div>
        <button class="btn btn-primary" onclick="adminOpenProductModal()">
          + Tambah Produk
        </button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Premi Dasar</th>
            <th>Maks. Pertanggungan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr></thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <span style="font-size:24px">${categoryIcon(p.category)}</span>
                    <div>
                      <div style="font-weight:600">${p.name}</div>
                      <div style="font-size:12px;color:var(--text-secondary);max-width:200px">${p.description.substring(0, 60)}...</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge ${categoryBadgeClass(p.category)}">${p.category}</span></td>
                <td style="font-weight:700;color:var(--blue-cta)">${formatRupiah(p.base_premium)}</td>
                <td>${formatRupiah(p.coverage_max)}</td>
                <td>${p.is_active ? '<span class="badge badge-success">Aktif</span>' : '<span class="badge badge-gray">Nonaktif</span>'}</td>
                <td>
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-ghost btn-sm" onclick='adminOpenProductModal(${JSON.stringify(p)})'>Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="adminDeleteProduct(${p.id}, '${p.name}')">Hapus</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Gagal memuat produk</div></div>`;
  }
}

function adminOpenProductModal(product = null) {
  const isEdit = !!product;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'product-modal';
  overlay.innerHTML = `
    <div class="modal" style="max-width:640px">
      <div class="modal-header">
        <h3 class="modal-title">${isEdit ? 'Edit' : 'Tambah'} Produk</h3>
        <button class="modal-close" onclick="document.getElementById('product-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <div id="prod-error" class="hidden" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:12px;font-size:14px;color:var(--error);margin-bottom:16px"></div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Nama Produk *</label>
            <input type="text" class="form-input" id="prod-name" value="${isEdit ? product.name : ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Kategori *</label>
            <select class="form-select" id="prod-category">
              ${['Jiwa','Kesehatan','Kendaraan','Properti'].map(c => `<option value="${c}" ${isEdit && product.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Deskripsi *</label>
          <textarea class="form-textarea" id="prod-desc" rows="3">${isEdit ? product.description : ''}</textarea>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Premi Dasar (Rp/bln) *</label>
            <input type="number" class="form-input" id="prod-premium" value="${isEdit ? product.base_premium : ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Maks. Pertanggungan (Rp) *</label>
            <input type="number" class="form-input" id="prod-coverage" value="${isEdit ? product.coverage_max : ''}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Fitur (satu per baris)</label>
          <textarea class="form-textarea" id="prod-features" rows="4">${isEdit ? (product.features || []).join('\n') : ''}</textarea>
        </div>
        ${isEdit ? `
          <div class="form-group">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
              <input type="checkbox" id="prod-active" ${product.is_active ? 'checked' : ''} style="width:16px;height:16px">
              <span class="form-label" style="margin:0">Produk Aktif</span>
            </label>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="document.getElementById('product-modal').remove()">Batal</button>
        <button class="btn btn-primary" id="prod-save-btn" onclick="adminSaveProduct(${isEdit ? product.id : 'null'})">
          ${isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add('show'), 10);
}

async function adminSaveProduct(id) {
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const description = document.getElementById('prod-desc').value.trim();
  const base_premium = document.getElementById('prod-premium').value;
  const coverage_max = document.getElementById('prod-coverage').value;
  const featuresRaw = document.getElementById('prod-features').value;
  const features = featuresRaw.split('\n').map(f => f.trim()).filter(f => f.length > 0);
  const is_active = id ? document.getElementById('prod-active')?.checked : true;
  const btn = document.getElementById('prod-save-btn');
  const errDiv = document.getElementById('prod-error');

  errDiv.classList.add('hidden');
  if (!name || !description || !base_premium || !coverage_max) {
    errDiv.textContent = 'Semua field wajib diisi';
    errDiv.classList.remove('hidden');
    return;
  }

  setButtonLoading(btn, true);
  try {
    if (id) {
      await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify({ name, category, description, base_premium: parseInt(base_premium), coverage_max: parseInt(coverage_max), features, is_active: is_active ? 1 : 0 }) });
      Toast.success('Produk diperbarui!', name);
    } else {
      await apiFetch('/products', { method: 'POST', body: JSON.stringify({ name, category, description, base_premium: parseInt(base_premium), coverage_max: parseInt(coverage_max), features }) });
      Toast.success('Produk berhasil ditambahkan!', name);
    }
    document.getElementById('product-modal').remove();
    adminLoadProducts();
  } catch (e) {
    errDiv.textContent = e.message;
    errDiv.classList.remove('hidden');
    setButtonLoading(btn, false);
  }
}

async function adminDeleteProduct(id, name) {
  if (!confirm(`Nonaktifkan produk "${name}"?`)) return;
  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    Toast.success('Produk dinonaktifkan', name);
    adminLoadProducts();
  } catch (e) {
    Toast.error('Gagal', e.message);
  }
}

async function adminLoadPolicies() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="skeleton" style="height:400px;border-radius:12px"></div>`;

  try {
    const policies = await apiFetch('/policies');
    content.innerHTML = `
      <div class="flex-between mb-6">
        <div>
          <h2 style="font-size:22px;font-weight:800;color:var(--navy)">Semua Polis Nasabah</h2>
          <p style="color:var(--text-secondary);font-size:14px;margin-top:4px">${policies.length} polis terdaftar</p>
        </div>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr>
            <th>Nasabah</th>
            <th>Nomor Polis</th>
            <th>Produk</th>
            <th>Tertanggung</th>
            <th>Pertanggungan</th>
            <th>Premi/Bulan</th>
            <th>Status</th>
            <th>Tanggal Mulai</th>
          </tr></thead>
          <tbody>
            ${policies.map(p => `
              <tr>
                <td><div style="font-weight:600">${p.user_name}</div><div style="font-size:12px;color:var(--text-secondary)">${p.user_email}</div></td>
                <td style="font-family:monospace;font-size:13px">${p.policy_number}</td>
                <td><span class="badge ${categoryBadgeClass(p.category)}">${p.category}</span><div style="font-size:13px;margin-top:2px">${p.product_name}</div></td>
                <td>${p.insured_name}</td>
                <td style="font-weight:700;color:var(--mint)">${formatRupiah(p.coverage_amount)}</td>
                <td style="font-weight:700;color:var(--blue-cta)">${formatRupiah(p.premium)}</td>
                <td>${statusBadge(p.status)}</td>
                <td style="font-size:13px;color:var(--text-secondary)">${formatDate(p.start_date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (e) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Gagal memuat polis</div></div>`;
  }
}
