const { Database } = require('bun:sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../lindara.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');
  }
  return db;
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Jiwa', 'Kesehatan', 'Kendaraan', 'Properti')),
      description TEXT NOT NULL,
      base_premium INTEGER NOT NULL,
      coverage_max INTEGER NOT NULL,
      features TEXT NOT NULL DEFAULT '[]',
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS policies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      policy_number TEXT NOT NULL UNIQUE,
      insured_name TEXT NOT NULL,
      coverage_amount INTEGER NOT NULL,
      premium INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
      start_date TEXT NOT NULL DEFAULT (date('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      policy_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      admin_note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (policy_id) REFERENCES policies(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  seedData(db);
  return db;
}

async function seedData(db) {
  const userCount = db.query('SELECT COUNT(*) as cnt FROM users').get();
  if (userCount.cnt > 0) return;

  const adminHash = await bcrypt.hash('admin123', 10);
  const customerHash = await bcrypt.hash('customer123', 10);

  db.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'Admin Lindara', 'admin@lindara.id', adminHash, 'admin'
  );
  db.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(
    'Budi Santoso', 'budi@example.com', customerHash, 'customer'
  );

  const products = [
    {
      name: 'Lindara Jiwa Prima',
      category: 'Jiwa',
      description: 'Perlindungan jiwa komprehensif untuk ketenangan pikiran keluarga Anda. Memberikan santunan kematian dan cacat tetap total.',
      base_premium: 150000,
      coverage_max: 500000000,
      features: JSON.stringify(['Santunan kematian hingga 500 juta', 'Cacat tetap total 100%', 'Bebas premi setelah klaim', 'Proses klaim 7 hari kerja'])
    },
    {
      name: 'Lindara Jiwa Keluarga',
      category: 'Jiwa',
      description: 'Proteksi jiwa untuk seluruh anggota keluarga dalam satu polis yang terjangkau dan fleksibel.',
      base_premium: 250000,
      coverage_max: 1000000000,
      features: JSON.stringify(['Coverage keluarga 1 polis', 'Santunan hingga 1 miliar', 'Tambahan rider kecelakaan', 'Customer service 24/7'])
    },
    {
      name: 'Lindara Sehat Plus',
      category: 'Kesehatan',
      description: 'Asuransi kesehatan premium dengan jaringan rumah sakit terluas di Indonesia, cashless di 500+ RS rekanan.',
      base_premium: 350000,
      coverage_max: 200000000,
      features: JSON.stringify(['Rawat inap & jalan', 'Cashless 500+ RS', 'Obat-obatan ditanggung', 'Medical check-up tahunan'])
    },
    {
      name: 'Lindara Sehat Eksekutif',
      category: 'Kesehatan',
      description: 'Perlindungan kesehatan kelas eksekutif dengan kamar VIP, layanan dokter pribadi, dan evakuasi medis.',
      base_premium: 750000,
      coverage_max: 500000000,
      features: JSON.stringify(['Kamar VIP', 'Dokter pribadi on-call', 'Evakuasi medis', 'Worldwide coverage'])
    },
    {
      name: 'Lindara Auto Proteksi',
      category: 'Kendaraan',
      description: 'Asuransi kendaraan all-risk yang melindungi mobil Anda dari risiko kecelakaan, pencurian, dan bencana alam.',
      base_premium: 200000,
      coverage_max: 800000000,
      features: JSON.stringify(['All-risk coverage', 'Bengkel rekanan 1000+', 'Mobil pengganti', 'Derek gratis 24 jam'])
    },
    {
      name: 'Lindara Motor Guard',
      category: 'Kendaraan',
      description: 'Proteksi sepeda motor lengkap dari risiko kecelakaan dan kehilangan dengan premi terjangkau.',
      base_premium: 80000,
      coverage_max: 100000000,
      features: JSON.stringify(['All-risk motor', 'Kehilangan total', 'Tanggung jawab pihak ketiga', 'Premi mulai 80 ribu/bulan'])
    },
    {
      name: 'Lindara Hunian Aman',
      category: 'Properti',
      description: 'Lindungi rumah dan properti Anda dari risiko kebakaran, bencana alam, dan pencurian dengan coverage menyeluruh.',
      base_premium: 180000,
      coverage_max: 2000000000,
      features: JSON.stringify(['Kebakaran & ledakan', 'Bencana alam', 'Pencurian & perampokan', 'Kerusakan akibat TPPO'])
    },
    {
      name: 'Lindara Bisnis Properti',
      category: 'Properti',
      description: 'Solusi asuransi properti bisnis untuk melindungi aset komersial, gedung perkantoran, dan inventaris usaha Anda.',
      base_premium: 500000,
      coverage_max: 10000000000,
      features: JSON.stringify(['Gedung & konten', 'Gangguan usaha', 'Tanggung jawab publik', 'Engineering breakdown'])
    }
  ];

  const insertProduct = db.query(
    'INSERT INTO products (name, category, description, base_premium, coverage_max, features) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const p of products) {
    insertProduct.run(p.name, p.category, p.description, p.base_premium, p.coverage_max, p.features);
  }
}

module.exports = { getDb, initDb };
