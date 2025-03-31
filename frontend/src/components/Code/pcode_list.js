// src/components/CodeRegisterModal.js
import React, { useState } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;
console.log(URL);
function CodeRegisterModal({ onClose, onSave }) {
  const [pcode, setPcode] = useState('');
  const [pcodeNm, setPcodeNm] = useState('');
  const [pcodeMemo, setPcodeMemo] = useState('');
  const [useTf, setUseTf] = useState('Y'); // 기본값: 사용("Y")
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    const data = {
      PCODE: pcode,
      PCODE_NM: pcodeNm,
      PCODE_MEMO: pcodeMemo,
      USE_TF: useTf,
    };

    try {
      // 백엔드 URL: http://localhost:4000/api/pcode
      const response = await axios.post(`${URL}/api/pcode`, data);
      console.log('등록 성공:', response.data);
      setMessage('코드 등록 성공');
      onSave(data); // 부모에게 저장 완료 후 처리 (예: 목록 새로고침)
    } catch (error) {
      console.error('코드 등록 실패:', error);
      setMessage('코드 등록 실패: ' + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>대분류 코드 등록 </h2>
        <div className="form-group">
          <label>코드 (PCODE)</label>
          <input type="text" value={pcode} onChange={(e) => setPcode(e.target.value)} />
        </div>
        <div className="form-group">
          <label>코드명 (PCODE_NM)</label>
          <input type="text" value={pcodeNm} onChange={(e) => setPcodeNm(e.target.value)} />
        </div>
        <div className="form-group">
          <label>코드설명 (PCODE_MEMO)</label>
          <textarea value={pcodeMemo} onChange={(e) => setPcodeMemo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>사용 여부 (USE_TF)</label>
          <div>
            <label>
              <input type="radio" name="useTf" checked={useTf === 'Y'} onChange={() => setUseTf('Y')} />
              사용
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input type="radio" name="useTf" checked={useTf === 'N'} onChange={() => setUseTf('N')} />
              미사용
            </label>
          </div>
        </div>
        <div className="button-group">
          <button onClick={handleSave}>저장</button>
          <button onClick={onClose}>닫기</button>
        </div>
        {message && (
          <div className="message" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d1e7dd', color: '#0f5132' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default CodeRegisterModal;
