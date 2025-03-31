// src/routes/posts.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// 글 등록 (POST /api/posts)
router.post('/', async (req, res) => {
  try {
    const { title, content_md, content_html } = req.body;
    if (!title || !content_md) {
      return res.status(400).json({ error: '제목과 내용(마크다운)은 필수입니다.' });
    }
    const sql = `
      INSERT INTO posts (title, content_md, content_html)
      VALUES (?, ?, ?)
    `;
    await pool.query(sql, [title, content_md, content_html]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB 에러' });
  }
});

// 글 목록 조회 (GET /api/posts)
router.get('/', async (req, res) => {
  try {
    const posts = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB 에러' });
  }
});

module.exports = router;
