// Auth Pages - Login & Register
function renderLoginPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-left">
        <div style="margin-bottom:48px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
            <div style="width:44px;height:44px;background:var(--blue-cta);border-radius:10px;display:flex;align-items:center;justify-content:center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:800;color:white">Lindara</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.5);font-style:italic">Lindungi yang Berharga.</div>
            </div>
          </div>
          <h2 style="font-size:36px;font-weight:800;color:white;line-height:1.2;margin-bottom:16px">Selamat Datang Kembali</h2>
          <p style="color:rgba(255,255,255,0.7);font-size:16px;line-height:1.7">Akses dashboard Anda untuk mengelola polis dan memantau klaim kapan saja.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:40px;height:40px;background:rgba(16,185,129,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">✓</div>
            <div style="color:rgba(255,255,255,0.8);font-size:15px">Dashboard nasabah lengkap</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:40px;height:40px;background:rgba(16,185,129,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">✓</div>
            <div style="color:rgba(255,255,255,0.8);font-size:15px">Klaim mudah & transparan</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:40px;height:40px;background:rgba(16,185,129,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">✓</div>
            <div style="color:rgba(255,255,255,0.8);font-size:15px">Notifikasi real-time</div>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <div class="auth-logo">
            <div style="width:48px;height:48px;background:var(--blue-cta);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
          </div>
          <h1 class="auth-title">Masuk ke Akun Anda</h1>
          <p class="auth-subtitle">Belum punya akun? <a href="/register">Daftar gratis</a></p>

          <div id="login-error" class="hidden" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:14px;font-size:14px;color:var(--error);margin-bottom:20px;display:flex;align-items:center;gap:8px">
            <span>⚠️</span><span id="login-error-text"></span>
          </div>

          <form id="login-form" onsubmit="submitLogin(event)">
            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-group">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" class="form-input" id="login-email" placeholder="nama@email.com" autocomplete="email" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" class="form-input" id="login-password" placeholder="Password Anda" autocomplete="current-password" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" id="login-btn">
              Masuk ke Akun
            </button>
          </form>

          <div style="text-align:center;margin-top:20px;font-size:13px;color:var(--text-secondary)">
            Akun demo: <strong>budi@example.com</strong> / <strong>customer123</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function submitLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  const errDiv = document.getElementById('login-error');
  const errText = document.getElementById('login-error-text');

  errDiv.classList.add('hidden');
  setButtonLoading(btn, true);

  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    Auth.setSession(res.token, res.user);
    renderNavbar();
    Toast.success('Berhasil masuk!', `Selamat datang, ${res.user.name}`);
    setTimeout(() => {
      if (res.user.role === 'admin') Router.navigate('/admin');
      else Router.navigate('/dashboard');
    }, 600);
  } catch (err) {
    errText.textContent = err.message;
    errDiv.classList.remove('hidden');
    setButtonLoading(btn, false);
  }
}

function renderRegisterPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-left">
        <div style="margin-bottom:48px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
            <div style="width:44px;height:44px;background:var(--blue-cta);border-radius:10px;display:flex;align-items:center;justify-content:center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:800;color:white">Lindara</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.5);font-style:italic">Lindungi yang Berharga.</div>
            </div>
          </div>
          <h2 style="font-size:36px;font-weight:800;color:white;line-height:1.2;margin-bottom:16px">Mulai Perjalanan Perlindungan Anda</h2>
          <p style="color:rgba(255,255,255,0.7);font-size:16px;line-height:1.7">Bergabung dengan 50.000+ nasabah yang sudah merasakan manfaat Lindara.</p>
        </div>
        <div style="background:rgba(255,255,255,0.08);border-radius:16px;padding:24px">
          <div style="color:white;font-weight:700;margin-bottom:12px">✨ Gratis selamanya:</div>
          <div style="display:flex;flex-direction:column;gap:10px">
            <div style="color:rgba(255,255,255,0.8);font-size:14px">✓ Hitung simulasi premi tanpa batas</div>
            <div style="color:rgba(255,255,255,0.8);font-size:14px">✓ Bandingkan semua produk asuransi</div>
            <div style="color:rgba(255,255,255,0.8);font-size:14px">✓ Dashboard nasabah lengkap</div>
            <div style="color:rgba(255,255,255,0.8);font-size:14px">✓ Notifikasi status klaim real-time</div>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <div class="auth-logo">
            <div style="width:48px;height:48px;background:var(--mint);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            </div>
          </div>
          <h1 class="auth-title">Buat Akun Baru</h1>
          <p class="auth-subtitle">Sudah punya akun? <a href="/login">Masuk di sini</a></p>

          <div id="reg-error" class="hidden" style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:14px;font-size:14px;color:var(--error);margin-bottom:20px;display:flex;align-items:center;gap:8px">
            <span>⚠️</span><span id="reg-error-text"></span>
          </div>

          <form id="register-form" onsubmit="submitRegister(event)">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <div class="input-group">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" class="form-input" id="reg-name" placeholder="Nama lengkap Anda" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="input-group">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" class="form-input" id="reg-email" placeholder="nama@email.com" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="input-group">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" class="form-input" id="reg-password" placeholder="Minimal 6 karakter" required minlength="6">
              </div>
              <span class="form-hint">Minimal 6 karakter</span>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" id="reg-btn">
              Buat Akun Gratis
            </button>
          </form>
          <p style="text-align:center;font-size:12px;color:var(--text-secondary);margin-top:16px">
            Dengan mendaftar, Anda menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> kami.
          </p>
        </div>
      </div>
    </div>
  `;
}

async function submitRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const btn = document.getElementById('reg-btn');
  const errDiv = document.getElementById('reg-error');
  const errText = document.getElementById('reg-error-text');

  errDiv.classList.add('hidden');
  setButtonLoading(btn, true);

  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    Auth.setSession(res.token, res.user);
    renderNavbar();
    Toast.success('Akun berhasil dibuat!', `Selamat datang, ${res.user.name}!`);
    setTimeout(() => Router.navigate('/dashboard'), 700);
  } catch (err) {
    errText.textContent = err.message;
    errDiv.classList.remove('hidden');
    setButtonLoading(btn, false);
  }
}
