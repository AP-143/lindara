const express = require('express');
const { getDb } = require('../db/database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const db = getDb();
  let claims;

  if (req.user.role === 'admin') {
    claims = db.prepare(`
      SELECT c.*, p.policy_number, pr.name as product_name, u.name as user_name, u.email as user_email
      FROM claims c
      JOIN policies p ON c.policy_id = p.id
      JOIN products pr ON p.product_id = pr.id
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `).all();
  } else {
    claims = db.prepare(`
      SELECT c.*, p.policy_number, pr.name as product_name
      FROM claims c
      JOIN policies p ON c.policy_id = p.id
      JOIN products pr ON p.product_id = pr.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `).all(req.user.id);
  }

  res.json(claims);
});

router.post('/', authMiddleware, (req, res) => {
  const { policy_id, amount, reason } = req.body;

  if (!policy_id || !amount || !reason) {
    return res.status(400).json({ error: 'Polis, jumlah klaim, dan alasan wajib diisi' });
  }
  if (reason.trim().length < 10) {
    return res.status(400).json({ error: 'Alasan klaim minimal 10 karakter' });
  }
  if (parseInt(amount) < 100000) {
    return res.status(400).json({ error: 'Jumlah klaim minimal Rp 100.000' });
  }

  const db = getDb();
  const policy = db.prepare('SELECT * FROM policies WHERE id = ? AND user_id = ?').get(policy_id, req.user.id);
  if (!policy) return res.status(404).json({ error: 'Polis tidak ditemukan' });
  if (policy.status !== 'active') return res.status(400).json({ error: 'Hanya polis aktif yang dapat mengajukan klaim' });

  const claimAmount = parseInt(amount);
  if (claimAmount > policy.coverage_amount) {
    return res.status(400).json({ error: `Jumlah klaim tidak boleh melebihi nilai pertanggungan Rp ${policy.coverage_amount.toLocaleString('id-ID')}` });
  }

  const result = db.prepare(`
    INSERT INTO claims (policy_id, user_id, amount, reason, status)
    VALUES (?, ?, ?, ?, 'pending')
  `).run(policy_id, req.user.id, claimAmount, reason.trim());

  const claim = db.prepare(`
    SELECT c.*, p.policy_number, pr.name as product_name
    FROM claims c
    JOIN policies p ON c.policy_id = p.id
    JOIN products pr ON p.product_id = pr.id
    WHERE c.id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json(claim);
});

router.patch('/:id', authMiddleware, adminOnly, (req, res) => {
  const { status, admin_note } = req.body;
  const validStatuses = ['approved', 'rejected'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status harus approved atau rejected' });
  }

  const db = getDb();
  const claim = db.prepare('SELECT * FROM claims WHERE id = ?').get(req.params.id);
  if (!claim) return res.status(404).json({ error: 'Klaim tidak ditemukan' });
  if (claim.status !== 'pending') return res.status(400).json({ error: 'Klaim sudah diproses sebelumnya' });

  db.prepare(`
    UPDATE claims SET status = ?, admin_note = ?, updated_at = datetime('now') WHERE id = ?
  `).run(status, admin_note || null, req.params.id);

  const updated = db.prepare(`
    SELECT c.*, p.policy_number, pr.name as product_name, u.name as user_name
    FROM claims c
    JOIN policies p ON c.policy_id = p.id
    JOIN products pr ON p.product_id = pr.id
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(req.params.id);

  res.json(updated);
});

module.exports = router;
