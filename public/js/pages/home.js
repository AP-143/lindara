// Home / Landing Page
async function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- HERO -->
    <section class="hero">
      <div class="container">
        <div class="hero-inner">
          <div class="hero-content">
            <div class="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Terpercaya sejak 2020
            </div>
            <h1 class="hero-title">
              Lindungi yang Paling<br><span>Berharga</span> dalam<br>Hidup Anda
            </h1>
            <p class="hero-subtitle">
              Platform asuransi digital terdepan Indonesia. Pilih dari 8+ produk terbaik, hitung premi instan, dan kelola semua perlindungan Anda dalam satu tempat.
            </p>
            <div class="hero-actions">
              <a href="/katalog" class="btn btn-primary btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Mulai Lindungi Sekarang
              </a>
              <a href="/katalog" class="btn btn-outline-white btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Hitung Premi Saya
              </a>
            </div>
            <div class="hero-stats">
              <div>
                <div class="hero-stat-num">50K+</div>
                <div class="hero-stat-label">Nasabah Aktif</div>
              </div>
              <div>
                <div class="hero-stat-num">8+</div>
                <div class="hero-stat-label">Produk Asuransi</div>
              </div>
              <div>
                <div class="hero-stat-num">4.9★</div>
                <div class="hero-stat-label">Rating Kepuasan</div>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="hero-card-preview">
              <div class="hero-card-tag">✓ Populer</div>
              <div class="hero-card-title">Lindara Sehat Plus</div>
              <div class="hero-card-desc">Cashless di 500+ RS rekanan seluruh Indonesia</div>
              <div class="hero-card-price">Mulai dari <strong>Rp 350.000</strong>/bulan</div>
              <div class="hero-card-features">
                <div class="hero-card-feature"><span class="check">✓</span> Rawat inap & jalan ditanggung</div>
                <div class="hero-card-feature"><span class="check">✓</span> Bebas pilih rumah sakit</div>
                <div class="hero-card-feature"><span class="check">✓</span> Proses klaim 3 hari kerja</div>
                <div class="hero-card-feature"><span class="check">✓</span> Customer service 24/7</div>
              </div>
              <a href="/katalog" class="btn btn-primary btn-full mt-4">Lihat Detail</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST STATS -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div>
            <div class="trust-number">50K+</div>
            <div class="trust-divider"></div>
            <div class="trust-label">Nasabah Terlindungi</div>
          </div>
          <div>
            <div class="trust-number">Rp 2T+</div>
            <div class="trust-divider"></div>
            <div class="trust-label">Total Pertanggungan</div>
          </div>
          <div>
            <div class="trust-number">98%</div>
            <div class="trust-divider"></div>
            <div class="trust-label">Klaim Dibayar</div>
          </div>
          <div>
            <div class="trust-number">5 Hari</div>
            <div class="trust-divider"></div>
            <div class="trust-label">Rata-Rata Proses Klaim</div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRODUCTS PREVIEW -->
    <section class="section" style="background:white">
      <div class="container">
        <div class="section-header">
          <div class="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Produk Unggulan
          </div>
          <h2 class="section-title">Perlindungan untuk Setiap Kebutuhan</h2>
          <p class="section-subtitle">Dari jiwa hingga properti, kami menyediakan solusi asuransi terlengkap untuk ketenangan pikiran Anda.</p>
        </div>
        <div class="grid-4" id="home-products">
          ${skeletonCards(4)}
        </div>
        <div class="text-center mt-8">
          <a href="/katalog" class="btn btn-outline btn-lg">
            Lihat Semua Produk
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    </section>

    <!-- BENEFITS -->
    <section class="section" style="background:var(--bg)">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Mengapa Lindara?</div>
          <h2 class="section-title">Lebih dari Sekedar Asuransi</h2>
          <p class="section-subtitle">Kami hadir dengan pengalaman digital yang modern dan layanan yang benar-benar mengutamakan Anda.</p>
        </div>
        <div class="grid-3">
          <div class="benefit-card">
            <div class="benefit-icon" style="background:rgba(37,99,235,0.1)">🚀</div>
            <div class="benefit-title">Daftar & Beli Instan</div>
            <div class="benefit-desc">Proses pembelian polis 100% digital. Dari pendaftaran hingga polis aktif, selesai dalam hitungan menit.</div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" style="background:rgba(16,185,129,0.1)">🛡️</div>
            <div class="benefit-title">Klaim Mudah & Cepat</div>
            <div class="benefit-desc">Ajukan klaim kapan saja melalui aplikasi. Tim kami memproses setiap klaim dalam 5 hari kerja.</div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" style="background:rgba(245,158,11,0.1)">💰</div>
            <div class="benefit-title">Premi Terjangkau</div>
            <div class="benefit-desc">Hitung simulasi premi Anda secara gratis. Temukan produk terbaik yang sesuai dengan anggaran.</div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" style="background:rgba(19,41,75,0.1)">📱</div>
            <div class="benefit-title">Kelola di Satu Tempat</div>
            <div class="benefit-desc">Lihat semua polis dan status klaim Anda di satu dashboard yang bersih dan intuitif.</div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" style="background:rgba(37,99,235,0.08)">🔒</div>
            <div class="benefit-title">Data Aman & Terenkripsi</div>
            <div class="benefit-desc">Keamanan data Anda adalah prioritas. Semua data dienkripsi dan disimpan dengan standar keamanan tinggi.</div>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" style="background:rgba(16,185,129,0.08)">🎯</div>
            <div class="benefit-title">Rekomendasi Tepat</div>
            <div class="benefit-desc">Kalkulator cerdas kami membantu menemukan produk yang paling sesuai dengan profil risiko Anda.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section" style="background:white">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Cara Kerja</div>
          <h2 class="section-title">3 Langkah Mudah Untuk Terlindungi</h2>
        </div>
        <div class="grid-3">
          <div style="text-align:center;padding:32px 24px">
            <div style="width:72px;height:72px;background:var(--blue-cta);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;color:white;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif">1</div>
            <h3 style="font-size:18px;font-weight:700;color:var(--navy);margin-bottom:10px">Pilih & Simulasi</h3>
            <p style="color:var(--text-secondary);font-size:14px;line-height:1.7">Jelajahi katalog produk dan hitung estimasi premi sesuai kebutuhan Anda secara gratis.</p>
          </div>
          <div style="text-align:center;padding:32px 24px">
            <div style="width:72px;height:72px;background:var(--mint);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;color:white;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif">2</div>
            <h3 style="font-size:18px;font-weight:700;color:var(--navy);margin-bottom:10px">Daftar & Beli</h3>
            <p style="color:var(--text-secondary);font-size:14px;line-height:1.7">Buat akun, lengkapi data tertanggung, dan aktifkan polis dalam hitungan menit.</p>
          </div>
          <div style="text-align:center;padding:32px 24px">
            <div style="width:72px;height:72px;background:var(--warning);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;color:white;font-weight:800;font-family:'Plus Jakarta Sans',sans-serif">3</div>
            <h3 style="font-size:18px;font-weight:700;color:var(--navy);margin-bottom:10px">Klaim Kapan Saja</h3>
            <p style="color:var(--text-secondary);font-size:14px;line-height:1.7">Ajukan klaim melalui dashboard, pantau prosesnya, dan terima pembayaran dengan cepat.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section" style="background:var(--bg)">
      <div class="container">
        <div class="section-header">
          <div class="section-label">Testimoni</div>
          <h2 class="section-title">Apa Kata Nasabah Kami</h2>
        </div>
        <div class="grid-3">
          <div class="testimonial-card">
            <div class="star-rating">★★★★★</div>
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">Proses klaim saya disetujui hanya dalam 3 hari kerja! Sungguh luar biasa. Tim Lindara sangat responsif dan profesional.</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">A</div>
              <div>
                <div class="testimonial-name">Ahmad Fauzi</div>
                <div class="testimonial-meta">Nasabah Lindara Sehat Plus</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="star-rating">★★★★★</div>
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">Akhirnya ada platform asuransi yang benar-benar digital. Dari hitung premi sampai beli polis, semua mudah dan transparan.</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar" style="background:var(--mint)">S</div>
              <div>
                <div class="testimonial-name">Siti Rahayu</div>
                <div class="testimonial-meta">Nasabah Lindara Jiwa Prima</div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="star-rating">★★★★★</div>
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">Sudah 2 tahun pakai Lindara Auto Proteksi. Waktu mobil saya kecelakaan, klaim cair dalam 5 hari. Tidak perlu ribet dokumen banyak.</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar" style="background:var(--warning)">B</div>
              <div>
                <div class="testimonial-name">Budi Hermawan</div>
                <div class="testimonial-meta">Nasabah Lindara Auto Proteksi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section faq-section" style="background:white">
      <div class="container">
        <div class="section-header">
          <div class="section-label">FAQ</div>
          <h2 class="section-title">Pertanyaan yang Sering Diajukan</h2>
        </div>
        <div style="max-width:720px;margin:0 auto">
          <div class="faq-item">
            <button class="faq-question" onclick="toggleFaq(this)">
              Bagaimana cara mengajukan klaim?
              <svg class="faq-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer"><div class="faq-answer-inner">Login ke akun Anda, buka menu Klaim, pilih polis yang ingin diklaim, isi jumlah dan alasan klaim, lalu submit. Tim kami akan memproses dalam 1-5 hari kerja.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-question" onclick="toggleFaq(this)">
              Berapa lama proses aktivasi polis?
              <svg class="faq-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer"><div class="faq-answer-inner">Polis aktif secara instan setelah data tertanggung dilengkapi dan pembayaran pertama dikonfirmasi, biasanya dalam 5-10 menit.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-question" onclick="toggleFaq(this)">
              Apakah saya bisa memiliki lebih dari satu polis?
              <svg class="faq-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer"><div class="faq-answer-inner">Ya, Anda dapat memiliki beberapa polis dari kategori berbeda maupun yang sama. Semua polis terkelola di satu dashboard nasabah.</div></div>
          </div>
          <div class="faq-item">
            <button class="faq-question" onclick="toggleFaq(this)">
              Apakah data saya aman?
              <svg class="faq-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer"><div class="faq-answer-inner">Keamanan data Anda adalah prioritas utama kami. Semua data dienkripsi dengan standar industri (AES-256) dan disimpan di server bersertifikasi ISO 27001.</div></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION -->
    <section style="background:linear-gradient(135deg,var(--navy) 0%,#2563EB 100%);padding:80px 0;text-align:center">
      <div class="container">
        <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:white;margin-bottom:16px">Siap Memulai Perlindungan Anda?</h2>
        <p style="color:rgba(255,255,255,0.75);font-size:18px;margin-bottom:36px;max-width:500px;margin-left:auto;margin-right:auto">Bergabung dengan 50.000+ nasabah yang sudah merasakan ketenangan pikiran bersama Lindara.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="/register" class="btn btn-mint btn-lg">Daftar Sekarang — Gratis</a>
          <a href="/katalog" class="btn btn-outline-white btn-lg">Lihat Produk</a>
        </div>
      </div>
    </section>
  `;

  renderFooter();
  initFaq();
  loadHomeProducts();
}

async function loadHomeProducts() {
  try {
    const products = await apiFetch('/products');
    const container = document.getElementById('home-products');
    if (!container) return;
    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(p => productCardHTML(p)).join('');
  } catch (e) {
    console.error(e);
  }
}

function productCardHTML(p) {
  const cat = categoryClass(p.category);
  return `
    <div class="product-card" onclick="Router.navigate('/produk/${p.id}')" style="cursor:pointer">
      <div class="product-card-header">
        <div class="product-icon ${cat}">${categoryIcon(p.category)}</div>
        <span class="product-badge ${categoryBadgeClass(p.category)}">${p.category}</span>
      </div>
      <div class="product-card-body">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description.substring(0, 100)}${p.description.length > 100 ? '...' : ''}</div>
        <div class="product-features">
          ${(p.features || []).slice(0, 3).map(f => `
            <div class="product-feature-item">
              <span class="feature-check">✓</span>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="product-card-footer">
        <div>
          <div class="product-price-label">Mulai dari</div>
          <div class="product-price">${formatRupiah(p.base_premium)}<span class="product-price-period">/bln</span></div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();Router.navigate('/produk/${p.id}')">Lihat Detail</button>
      </div>
    </div>
  `;
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  item.classList.toggle('open');
}

function initFaq() {
  // already using onclick
}

function renderFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="footer-logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div class="footer-logo-name">Lindara</div>
                <div class="footer-tagline">Lindungi yang Berharga.</div>
              </div>
            </div>
            <p class="footer-brand-desc">Platform asuransi digital terpercaya yang menghadirkan perlindungan modern untuk keluarga dan aset Anda.</p>
            <div class="footer-badges">
              <span class="footer-badge">🔒 SSL Secured</span>
              <span class="footer-badge">✓ OJK Terdaftar</span>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Produk</div>
            <div class="footer-links">
              <a href="/katalog?cat=Jiwa" class="footer-link">Asuransi Jiwa</a>
              <a href="/katalog?cat=Kesehatan" class="footer-link">Asuransi Kesehatan</a>
              <a href="/katalog?cat=Kendaraan" class="footer-link">Asuransi Kendaraan</a>
              <a href="/katalog?cat=Properti" class="footer-link">Asuransi Properti</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Nasabah</div>
            <div class="footer-links">
              <a href="/register" class="footer-link">Daftar Sekarang</a>
              <a href="/login" class="footer-link">Masuk Akun</a>
              <a href="/dashboard" class="footer-link">Dashboard</a>
              <a href="/klaim" class="footer-link">Ajukan Klaim</a>
            </div>
          </div>
          <div>
            <div class="footer-col-title">Perusahaan</div>
            <div class="footer-links">
              <a href="#" class="footer-link">Tentang Kami</a>
              <a href="#" class="footer-link">Karir</a>
              <a href="#" class="footer-link">Kebijakan Privasi</a>
              <a href="#" class="footer-link">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
        <hr class="footer-divider">
        <div class="footer-bottom">
          <div class="footer-bottom-text">© 2024 Lindara. Hak cipta dilindungi. Terdaftar dan diawasi OJK.</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.5)">Dibuat dengan ❤️ di Indonesia</div>
        </div>
      </div>
    </footer>
  `;
}
