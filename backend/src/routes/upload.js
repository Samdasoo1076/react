// backend/src/routes/upload.js
const express = require('express');
const multer  = require('multer');
const path = require('path');
const router = express.Router();

// 파일 업로드 설정 (예시: uploads 폴더에 저장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // uploads 폴더가 존재해야 합니다.
  },
  filename: (req, file, cb) => {
    // 원본 파일명을 사용하거나, timestamp를 붙이는 방식으로 처리
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 이미지 업로드 엔드포인트
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '파일 업로드 실패' });
  // 예시 URL: 실제 서버 도메인 또는 localhost:4000 기준
  const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

module.exports = router;
