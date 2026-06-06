const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

function generatePolicyNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `LDR-${year}${month}-${random}`;
}

router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  let policies;

  if (req.user.role === 'admin') {
    policies = db.prepare(`
      SELECT p.*, u.name as user_name, u.email as user_email, pr.name as product_name, pr.category
      FROM policies p
      JOIN users u ON p.user_id = u.id
      JOIN products pr ON p.product_id = pr.id
      ORDER BY p.created_at DESC
    `).all();
  } else {
    policies = db.prepare(`
      SELECT p.*, pr.name as product_name, pr.category
      FROM policies p
      JOIN products pr ON p.product_id = pr.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.user.id);
  }

  res.json(policies);
});

router.post('/', authMiddleware, (req, res) => {
  const { product_id, insured_name, coverage_amount, duration_years } = req.body;

  if (!product_id || !insured_name || !coverage_amount) {
    return res.status(400).json({ error: 'Produk, nama tertanggung, dan nilai pertanggungan wajib diisi' });
  }

  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(product_id);
  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan atau tidak aktif' });

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const coverageNum = parseInt(coverage_amount);
  const durationNum = parseInt(duration_years) || 1;

  const ageFactor = 1.2;
  const coverageRatio = coverageNum / 100000000;
  const premium = Math.round(product.base_premium * ageFactor * coverageRatio);

  let policyNumber;
  let attempts = 0;
  do {
    policyNumber = generatePolicyNumber();
    const existing = db.prepare('SELECT id FROM policies WHERE policy_number = ?').get(policyNumber);
    if (!existing) break;
    attempts++;
  } while (attempts < 10);

  const startDate = new Date().toISOString().split('T')[0];

  const result = db.prepare(`
    INSERT INTO policies (user_id, product_id, policy_number, insured_name, coverage_amount, premium, status, start_date)
    VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
  `).run(req.user.id, product_id, policyNumber, insured_name.trim(), coverageNum, premium, startDate);

  const policy = db.prepare(`
    SELECT p.*, pr.name as product_name, pr.category
    FROM policies p
    JOIN products pr ON p.product_id = pr.id
    WHERE p.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(policy);
});

module.exports = router;
