// Customer Dashboard Page
async function renderDashboardPage() {
  if (!requireAuth('customer')) return;

  const user = Auth.getUser();
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">Selamat datang, ${user?.name?.split(' ')[0] || 'Nasabah'} 👋</h1>
        <p class="page-subtitle">Kelola polis dan pantau klaim Anda</p>
      </div>
    </div>
    <div class="main-content">
      <div class="container">
        <!-- Stats -->
        <div class="grid-4 mb-8" id="dashboard-stats">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(37,99,235,0.1)">📋</div>
            <div><div class="stat-value" id="stat-policies">—</div><div class="stat-label">Total Polis</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(16,185,129,0.1)">✅</div>
            <div><div class="stat-value" id="stat-active">—</div><div class="stat-label">Polis Aktif</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(245,158,11,0.1)">📝</div>
            <div><div class="stat-value" id="stat-claims">—</div><div class="stat-label">Total Klaim</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(239,68,68,0.1)">⏳</div>
            <div><div class="stat-value" id="stat-pending">—</div><div class="stat-label">Klaim Pending</div></div>
          </div>
        </div>

        <!-- Policies Section -->
        <div class="flex-between mb-4">
          <h2 style="font-size:20px;font-weight:700;color:var(--navy)">Polis Saya</h2>
          <a href="/katalog" class="btn btn-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Beli Polis Baru
          </a>
        </div>
        <div id="policies-list">
          <div class="skeleton" style="height:120px;border-radius:12px;margin-bottom:12px"></div>
          <div class="skeleton" style="height:120px;border-radius:12px"></div>
        </div>

        <!-- Claims Section -->
        <div class="flex-between mb-4 mt-8">
          <h2 style="font-size:20px;font-weight:700;color:var(--navy)">Riwayat Klaim</h2>
          <a href="/klaim" class="btn btn-outline btn-sm">Ajukan Klaim Baru</a>
        </div>
        <div id="claims-list">
          <div class="skeleton" style="height:80px;border-radius:12px"></div>
        </div>
      </div>
    </div>
  `;

  renderFooter();
  loadDashboardData();
}

async function loadDashboardData() {
  try {
    const [policies, claims] = await Promise.all([
      apiFetch('/policies'),
      apiFetch('/claims')
    ]);

    // Stats
    const activePolicies = policies.filter(p => p.status === 'active').length;
    const pendingClaims = claims.filter(c => c.status === 'pending').length;

    document.getElementById('stat-policies').textContent = policies.length;
    document.getElementById('stat-active').textContent = activePolicies;
    document.getElementById('stat-claims').textContent = claims.length;
    document.getElementById('stat-pending').textContent = pendingClaims;

    // Policies
    const policiesList = document.getElementById('policies-list');
    if (!policies.length) {
      policiesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🛡️</div>
          <div class="empty-title">Belum ada polis</div>
          <div class="empty-desc">Mulai lindungi diri Anda dengan membeli polis pertama</div>
          <a href="/katalog" class="btn btn-primary">Lihat Produk</a>
        </div>
      `;
    } else {
      policiesList.innerHTML = policies.map(p => `
        <div class="card mb-3" style="border-left:4px solid ${p.status === 'active' ? 'var(--mint)' : 'var(--border)'}">
          <div class="card-body" style="display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center">
            <div style="font-size:36px">${categoryIcon(p.category)}</div>
            <div>
              <div style="font-weight:700;color:var(--navy);font-size:16px;margin-bottom:4px">${p.product_name}</div>
              <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
                <span style="font-size:13px;color:var(--text-secondary)">📋 ${p.policy_number}</span>
                <span style="font-size:13px;color:var(--text-secondary)">👤 ${p.insured_name}</span>
                <span style="font-size:13px;color:var(--text-secondary)">📅 ${formatDate(p.start_date)}</span>
              </div>
              <div style="margin-top:8px;display:flex;gap:12px;flex-wrap:wrap">
                <span style="font-size:13px">Pertanggungan: <strong style="color:var(--mint)">${formatRupiah(p.coverage_amount)}</strong></span>
                <span style="font-size:13px">Premi: <strong style="color:var(--blue-cta)">${formatRupiah(p.premium)}/bln</strong></span>
              </div>
            </div>
            <div style="text-align:right">
              ${statusBadge(p.status)}
              ${p.status === 'active' ? `
                <div style="margin-top:8px">
                  <a href="/klaim" class="btn btn-outline btn-sm">Ajukan Klaim</a>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }

    // Claims
    const claimsList = document.getElementById('claims-list');
    if (!claims.length) {
      claimsList.innerHTML = `<div class="empty-state"><div class="empty-icon">📝</div><div class="empty-title">Belum ada klaim</div><div class="empty-desc">Klaim akan muncul di sini setelah Anda mengajukan</div></div>`;
    } else {
      claimsList.innerHTML = `
        <div class="table-wrapper">
          <table>
            <thead><tr>
              <th>Polis</th>
              <th>Jumlah Klaim</th>
              <th>Alasan</th>
              <th>Status</th>
              <th>Tanggal</th>
            </tr></thead>
            <tbody>
              ${claims.map(c => `
                <tr>
                  <td><div style="font-weight:600">${c.product_name}</div><div style="font-size:12px;color:var(--text-secondary)">${c.policy_number}</div></td>
                  <td><strong style="color:var(--blue-cta)">${formatRupiah(c.amount)}</strong></td>
                  <td style="max-width:200px;color:var(--text-secondary);font-size:13px">${c.reason}</td>
                  <td>${statusBadge(c.status)}${c.admin_note ? `<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Catatan: ${c.admin_note}</div>` : ''}</td>
                  <td style="color:var(--text-secondary);font-size:13px">${formatDate(c.created_at)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (e) {
    Toast.error('Gagal memuat data', e.message);
  }
}
