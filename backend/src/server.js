// src/server.js
require('dotenv').config(); // .env 파일 로드
const express = require('express');
const cors = require('cors');
const postRoutes = require('./routes/posts');
const codeRoutes = require('./routes/pcode'); 

const corsOptions = {
  origin: '${process.env.REACT_APP_API_URL}:3000',
  optionsSuccessStatus: 200,
};

const app = express();

const uploadRoutes = require('./routes/upload');
// ...
app.use(cors());

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/api/upload', uploadRoutes);
app.use('/api/pcode', codeRoutes);
app.use('/uploads', express.static('uploads'));
// API 라우터 설정
app.use('/api/posts', postRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('백엔드 서버 루트 디렉터리');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
