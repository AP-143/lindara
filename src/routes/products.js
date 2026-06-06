const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { category } = req.query;
  let query = 'SELECT * FROM products WHERE is_active = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  query += ' ORDER BY category, name';

  const products = db.prepare(query).all(...params);
  products.forEach(p => { p.features = JSON.parse(p.features || '[]'); });
  res.json(products);
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });
  product.features = JSON.parse(product.features || '[]');
  res.json(product);
});

router.post('/:id/quote', (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });

  const { age, coverage_amount, duration_years } = req.body;

  if (!age || !coverage_amount || !duration_years) {
    return res.status(400).json({ error: 'Usia, nilai pertanggungan, dan durasi wajib diisi' });
  }

  const ageNum = parseInt(age);
  const coverageNum = parseInt(coverage_amount);
  const durationNum = parseInt(duration_years);

  if (ageNum < 17 || ageNum > 70) return res.status(400).json({ error: 'Usia harus antara 17-70 tahun' });
  if (coverageNum < 1000000) return res.status(400).json({ error: 'Nilai pertanggungan minimal Rp 1.000.000' });
  if (coverageNum > product.coverage_max) return res.status(400).json({ error: `Nilai pertanggungan maksimal Rp ${product.coverage_max.toLocaleString('id-ID')}` });
  if (durationNum < 1 || durationNum > 30) return res.status(400).json({ error: 'Durasi harus antara 1-30 tahun' });

  let ageFactor = 1;
  if (ageNum >= 18 && ageNum <= 30) ageFactor = 1.0;
  else if (ageNum <= 40) ageFactor = 1.2;
  else if (ageNum <= 50) ageFactor = 1.5;
  else if (ageNum <= 60) ageFactor = 2.0;
  else ageFactor = 2.8;

  const coverageRatio = coverageNum / 100000000;
  const monthlyPremium = Math.round(product.base_premium * ageFactor * coverageRatio);
  const annualPremium = Math.round(monthlyPremium * 12 * 0.95);

  res.json({
    product_id: product.id,
    product_name: product.name,
    age: ageNum,
    coverage_amount: coverageNum,
    duration_years: durationNum,
    monthly_premium: monthlyPremium,
    annual_premium: annualPremium,
    total_premium: annualPremium * durationNum
  });
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { name, category, description, base_premium, coverage_max, features } = req.body;

  if (!name || !category || !description || !base_premium || !coverage_max) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }
  const validCategories = ['Jiwa', 'Kesehatan', 'Kendaraan', 'Properti'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Kategori tidak valid' });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO products (name, category, description, base_premium, coverage_max, features) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(name, category, description, parseInt(base_premium), parseInt(coverage_max), JSON.stringify(features || []));

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  product.features = JSON.parse(product.features);
  res.status(201).json(product);
});

router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, category, description, base_premium, coverage_max, features, is_active } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Produk tidak ditemukan' });

  db.prepare(`
    UPDATE products SET name=?, category=?, description=?, base_premium=?, coverage_max=?, features=?, is_active=?
    WHERE id=?
  `).run(
    name || existing.name,
    category || existing.category,
    description || existing.description,
    base_premium ? parseInt(base_premium) : existing.base_premium,
    coverage_max ? parseInt(coverage_max) : existing.coverage_max,
    JSON.stringify(features || JSON.parse(existing.features)),
    is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  updated.features = JSON.parse(updated.features);
  res.json(updated);
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Produk tidak ditemukan' });

  db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Produk berhasil dinonaktifkan' });
});

module.exports = router;
