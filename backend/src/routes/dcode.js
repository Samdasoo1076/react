// src/routes/dcode.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js'); // 실제 db.js 파일 경로에 맞게 수정

// 1. 세부분류코드 등록 (POST /api/dcode)
router.post('/', async (req, res) => {
  const { DCODE, DCODE_NM, ORDER_NO } = req.body;

  if (!DCODE || !DCODE_NM) {
    return res.status(400).json({ message: '필수 항목(세부분류코드, 세부분류코드명)이 누락되었습니다.' });
  }

  try {
    const now = new Date();
    const sql = `
      INSERT INTO TBL_DCODE
        (DCODE, DCODE_NM, ORDER_NO, REG_DATE, UP_DATE)
      VALUES
        (?, ?, ?, ?, ?)
    `;

    // 쿼리 실행 (mysql2는 [rows, fields] 형태로 반환)
    const [resultOrArray] = await pool.execute(sql, [DCODE, DCODE_NM, ORDER_NO, now, now]);

    res.status(201).json({
      message: '세부분류코드 등록 성공',
      insertedId: resultOrArray.insertId
    });
  } catch (error) {
    console.error('세부분류코드 등록 에러:', error);
    res.status(500).json({ message: '세부분류코드 등록 실패', error: error.message });
  }
});

// 2. 세부분류코드 목록 조회 (GET /api/dcode)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM TBL_DCODE ORDER BY ORDER_NO ASC'
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('세부분류코드 조회 에러:', error);
    res.status(500).json({ message: '세부분류코드 조회 실패', error: error.message });
  }
});

// 3. 세부분류코드 상세 조회 (GET /api/dcode/:dcode)
router.get('/:dcode', async (req, res) => {
  const { dcode } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM TBL_DCODE WHERE DCODE = ?',
      [dcode]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: '세부분류코드를 찾을 수 없습니다.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('세부분류코드 상세 조회 에러:', error);
    res.status(500).json({ message: '세부분류코드 상세 조회 실패', error: error.message });
  }
});

// 4. 세부분류코드 수정 (PUT /api/dcode/:dcode)
router.put('/:dcode', async (req, res) => {
  const { dcode } = req.params;
  const { DCODE_NM, ORDER_NO } = req.body;

  try {
    const now = new Date();
    const sql = `
      UPDATE TBL_DCODE
      SET DCODE_NM = ?, ORDER_NO = ?, UP_DATE = ?
      WHERE DCODE = ?
    `;
    const [result] = await pool.execute(sql, [DCODE_NM, ORDER_NO, now, dcode]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '세부분류코드를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '세부분류코드 수정 성공' });
  } catch (error) {
    console.error('세부분류코드 수정 에러:', error);
    res.status(500).json({ message: '세부분류코드 수정 실패', error: error.message });
  }
});

module.exports = router;
