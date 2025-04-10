// src/routes/code.js
const express = require('express');
const router = express.Router();
const pool = require('../db.js'); // db.js 파일의 경로를 프로젝트 구조에 맞게 수정하세요.

router.post('/', async (req, res) => {
    const { PCODE, PCODE_NM, PCODE_MEMO, USE_TF } = req.body;
  
    if (!PCODE || !PCODE_NM) {
      return res.status(400).json({ message: '필수 항목(코드, 코드명)이 누락되었습니다.' });
    }
  
    try {
      const now = new Date();
      const DEL_TF = 'N';
      const sql = `
        INSERT INTO TBL_CODE_PARENT
          (PCODE, PCODE_NM, PCODE_MEMO, REG_DATE, UP_DATE, USE_TF, DEL_TF)
        VALUES
          (?, ?, ?, ?, ?, ?, ?)
      `;
  
      // 쿼리 실행
      const resultOrArray = await pool.execute(sql, [PCODE, PCODE_NM, PCODE_MEMO, now, now, USE_TF, DEL_TF]);
  
      // 반환 결과가 배열인지 객체인지 확인
      let result;
      if (Array.isArray(resultOrArray)) {
        // mysql2의 경우 일반적으로 [rows, fields] 형태로 반환됩니다.
        result = resultOrArray[0];
      } else {
        // 만약 객체 형태로 반환되면 바로 사용
        result = resultOrArray;
      }
  
      res.status(201).json({ message: '코드 등록 성공', insertedId: result.insertId.toString() });
    } catch (error) {
      console.error('코드 등록 에러:', error);
      res.status(500).json({ message: '코드 등록 실패', error: error.message });
    }
  });


  // 코드 목록 조회 엔드포인트
  router.get('/', async (req, res) => {
    try {
      const result = await pool.execute(
        'SELECT * FROM TBL_CODE_PARENT ORDER BY UP_DATE DESC'
      );
      res.json(result);
    } catch (error) {
      console.error('코드 조회 에러:', error);
      res.status(500).json({ message: '코드 조회 실패', error: error.message });
    }
  });
  
  // 코드 상세 조회 엔드포인트
  router.get('/:pcode', async (req, res) => {
    const { pcode } = req.params;
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM TBL_CODE_PARENT WHERE PCODE = ?',
        [pcode]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: '코드를 찾을 수 없습니다.' });
      }
      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('코드 상세 조회 에러:', error);
      res.status(500).json({ message: '코드 상세 조회 실패', error: error.message });
    }
  });

  // 코드 수정 (PUT) 엔드포인트 (PCODE를 URL 파라미터로 사용)
  router.put('/:pcode', async (req, res) => {
    const { pcode } = req.params;
    const { PCODE_NM, PCODE_MEMO, USE_TF } = req.body;
    try {
      const now = new Date();
      const sql = `
        UPDATE TBL_CODE_PARENT
        SET PCODE_NM = ?, PCODE_MEMO = ?, USE_TF = ?, UP_DATE = ?
        WHERE PCODE = ?
      `;
      // pool.execute의 반환값을 먼저 변수에 할당
      const resultOrArray = await pool.execute(sql, [PCODE_NM, PCODE_MEMO, USE_TF, now, pcode]);

      // 반환값이 배열이면 첫 번째 요소(실제 결과)를 사용, 아니면 그대로 사용
      const result = Array.isArray(resultOrArray) ? resultOrArray[0] : resultOrArray;

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '코드를 찾을 수 없습니다.' });
      }
      res.json({ message: '코드 수정 성공' });
    } catch (error) {
      console.error('코드 수정 에러:', error);
      res.status(500).json({ message: '코드 수정 실패', error: error.message });
    }
  });


module.exports = router;
