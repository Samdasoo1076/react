// src/components/Code/CodeDetailModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL; // 예: http://localhost:4000

function CodeDetailModal({ code, onClose, onUpdate }) {
  const [detail, setDetail] = useState(code);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 만약 백엔드에서 별도로 상세 정보를 불러와야 한다면 useEffect로 추가 요청 가능
  // 예: 
  // useEffect(() => {
  //   const fetchDetail = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`${URL}/api/pcode/${code.PCODE}`);
  //       setDetail(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError(err);
  //       setLoading(false);
  //     }
  //   };
  //   fetchDetail();
  // }, [code.PCODE]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${URL}/api/pcode/${detail.PCODE}`, {
        PCODE_NM: detail.PCODE_NM,
        PCODE_MEMO: detail.PCODE_MEMO,
        USE_TF: detail.USE_TF,
      });
      console.log('수정 성공:', response.data);
      if (onUpdate) {
        onUpdate(detail);
      }
      onClose();
    } catch (err) {
      console.error('수정 실패:', err);
      setError(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>코드 상세 / 수정</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>오류 발생: {error.message}</p>
        ) : (
          <>
            <div className="form-group">
              <label>코드 (PCODE)</label>
              <input
                type="text"
                value={detail.PCODE}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>코드명 (PCODE_NM)</label>
              <input
                type="text"
                value={detail.PCODE_NM}
                onChange={(e) => setDetail({ ...detail, PCODE_NM: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>코드설명 (PCODE_MEMO)</label>
              <textarea
                value={detail.PCODE_MEMO}
                onChange={(e) => setDetail({ ...detail, PCODE_MEMO: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>사용 여부 (USE_TF)</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="useTfDetail"
                    checked={detail.USE_TF === 'Y'}
                    onChange={() => setDetail({ ...detail, USE_TF: 'Y' })}
                  />
                  사용
                </label>
                <label style={{ marginLeft: '10px' }}>
                  <input
                    type="radio"
                    name="useTfDetail"
                    checked={detail.USE_TF === 'N'}
                    onChange={() => setDetail({ ...detail, USE_TF: 'N' })}
                  />
                  미사용
                </label>
              </div>
            </div>
            <div className="button-group">
              <button onClick={handleUpdate}>수정 저장</button>
              <button onClick={onClose}>닫기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CodeDetailModal;
