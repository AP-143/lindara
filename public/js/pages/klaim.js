// Klaim Page
async function renderKlaimPage() {
  if (!requireAuth('customer')) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="page-header">
      <div class="container">
        <div class="breadcrumb">
          <a href="/">Beranda</a>
          <span class="breadcrumb-sep">›</span>
          <a href="/dashboard">Dashboard</a>
          <span class="breadcrumb-sep">›</span>
          <span>Ajukan Klaim</span>
        </div>
        <h1 class="page-title">Pengajuan Klaim</h1>
        <p class="page-subtitle">Ajukan klaim atas polis aktif Anda dengan mudah</p>
      </div>
    </div>
    <div class="main-content">
      <div class="container" style="max-width:800px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">
          <!-- Form -->
          <div class="card">
            <div class="card-header">
              <h3 style="font-weight:700;color:var(--navy)">Form Pengajuan Klaim</h3>
            </div>
            <div class="card-body">
              <div id="klaim-error" class="hidden" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:14px;font-size:14px;color:var(--error);margin-bottom:20px"></div>

              <div class="form-group">
                <label class="form-label">Pilih Polis *</label>
                <select class="form-select" id="claim-policy" onchange="onPolicySelect()">
                  <option value="">Memuat polis...</option>
                </select>
              </div>
              <div id="policy-info" class="hidden" style="background:var(--bg);border-radius:10px;padding:16px;margin-bottom:16px">
                <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">Nilai Pertanggungan</div>
                <div id="policy-coverage" style="font-size:18px;font-weight:700;color:var(--mint)"></div>
              </div>
              <div class="form-group">
                <label class="form-label">Jumlah Klaim (Rp) *</label>
                <input type="number" class="form-input" id="claim-amount" placeholder="Masukkan jumlah klaim" min="100000">
                <span class="form-hint" id="claim-max-hint">Minimal Rp 100.000</span>
              </div>
              <div class="form-group">
                <label class="form-label">Alasan & Kronologi *</label>
                <textarea class="form-textarea" id="claim-reason" placeholder="Jelaskan alasan pengajuan klaim secara detail (minimal 10 karakter)..." rows="5"></textarea>
              </div>
              <button class="btn btn-primary btn-full" id="claim-submit-btn" onclick="submitClaim()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Ajukan Klaim
              </button>
            </div>
          </div>

          <!-- Claims History -->
          <div>
            <h3 style="font-size:18px;font-weight:700;color:var(--navy);margin-bottom:16px">Riwayat Klaim</h3>
            <div id="klaim-history">
              <div class="skeleton" style="height:80px;border-radius:12px;margin-bottom:8px"></div>
              <div class="skeleton" style="height:80px;border-radius:12px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  renderFooter();
  loadKlaimData();
}

let userPolicies = [];

async function loadKlaimData() {
  try {
    const [policies, claims] = await Promise.all([
      apiFetch('/policies'),
      apiFetch('/claims')
    ]);

    userPolicies = policies.filter(p => p.status === 'active');

    const select = document.getElementById('claim-policy');
    if (!userPolicies.length) {
      select.innerHTML = '<option value="">Tidak ada polis aktif</option>';
      document.getElementById('claim-submit-btn').disabled = true;
    } else {
      select.innerHTML = `<option value="">-- Pilih Polis --</option>` +
        userPolicies.map(p => `<option value="${p.id}" data-coverage="${p.coverage_amount}">${p.policy_number} — ${p.product_name}</option>`).join('');
    }

    const histDiv = document.getElementById('klaim-history');
    if (!claims.length) {
      histDiv.innerHTML = `<div class="empty-state" style="padding:32px 16px"><div class="empty-icon">📝</div><div class="empty-title" style="font-size:16px">Belum ada klaim</div></div>`;
    } else {
      histDiv.innerHTML = claims.map(c => `
        <div class="card mb-3" style="border-left:4px solid ${c.status === 'approved' ? 'var(--mint)' : c.status === 'rejected' ? 'var(--error)' : 'var(--warning)'}">
          <div class="card-body" style="padding:16px">
            <div class="flex-between mb-2">
              <div style="font-weight:700;font-size:14px;color:var(--navy)">${c.product_name}</div>
              ${statusBadge(c.status)}
            </div>
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">${c.policy_number}</div>
            <div style="font-size:15px;font-weight:700;color:var(--blue-cta)">${formatRupiah(c.amount)}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${c.reason.substring(0, 80)}${c.reason.length > 80 ? '...' : ''}</div>
            ${c.admin_note ? `<div style="font-size:12px;margin-top:6px;padding:6px 10px;background:var(--bg);border-radius:6px;color:var(--text-secondary)">💬 ${c.admin_note}</div>` : ''}
            <div style="font-size:12px;color:var(--text-secondary);margin-top:6px">${formatDate(c.created_at)}</div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    Toast.error('Gagal memuat data', e.message);
  }
}

function onPolicySelect() {
  const select = document.getElementById('claim-policy');
  const opt = select.options[select.selectedIndex];
  const coverage = opt.dataset.coverage;
  const infoDiv = document.getElementById('policy-info');
  const hintEl = document.getElementById('claim-max-hint');

  if (coverage) {
    infoDiv.classList.remove('hidden');
    document.getElementById('policy-coverage').textContent = formatRupiah(parseInt(coverage));
    hintEl.textContent = `Minimal Rp 100.000 — Maks ${formatRupiah(parseInt(coverage))}`;
  } else {
    infoDiv.classList.add('hidden');
    hintEl.textContent = 'Minimal Rp 100.000';
  }
}

async function submitClaim() {
  const policyId = document.getElementById('claim-policy').value;
  const amount = document.getElementById('claim-amount').value;
  const reason = document.getElementById('claim-reason').value;
  const btn = document.getElementById('claim-submit-btn');
  const errDiv = document.getElementById('klaim-error');

  errDiv.classList.add('hidden');

  if (!policyId) { errDiv.textContent = 'Pilih polis terlebih dahulu'; errDiv.classList.remove('hidden'); return; }
  if (!amount || parseInt(amount) < 100000) { errDiv.textContent = 'Jumlah klaim minimal Rp 100.000'; errDiv.classList.remove('hidden'); return; }
  if (!reason || reason.trim().length < 10) { errDiv.textContent = 'Alasan minimal 10 karakter'; errDiv.classList.remove('hidden'); return; }

  setButtonLoading(btn, true);
  try {
    await apiFetch('/claims', {
      method: 'POST',
      body: JSON.stringify({ policy_id: parseInt(policyId), amount: parseInt(amount), reason: reason.trim() })
    });
    Toast.success('Klaim berhasil diajukan!', 'Tim kami akan memprosesnya dalam 1-5 hari kerja');
    document.getElementById('claim-policy').value = '';
    document.getElementById('claim-amount').value = '';
    document.getElementById('claim-reason').value = '';
    document.getElementById('policy-info').classList.add('hidden');
    await loadKlaimData();
  } catch (e) {
    errDiv.textContent = e.message;
    errDiv.classList.remove('hidden');
  } finally {
    setButtonLoading(btn, false);
  }
}
