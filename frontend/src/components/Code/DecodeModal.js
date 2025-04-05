// src/components/Code/DcodeModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL; // 예: http://localhost:4000

function DcodeModal({ onClose, onSave }) {
  // 폼 상태: 선택된 항목이 없으면 신규 등록, 있으면 수정
  const [dcode, setDcode] = useState('');
  const [dcodeNm, setDcodeNm] = useState('');
  const [order, setOrder] = useState('');
  const [message, setMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // 리스트 상태
  const [dcodeList, setDcodeList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // 기존 세부분류코드 리스트 fetch
  useEffect(() => {
    const fetchDcodes = async () => {
      try {
        const response = await axios.get(`${URL}/api/dcode`);
        setDcodeList(response.data);
        setListLoading(false);
      } catch (error) {
        setListError(error);
        setListLoading(false);
      }
    };
    fetchDcodes();
  }, []);

  // 폼 제출: 등록 또는 수정
  const handleSubmit = async () => {
    // 폼 데이터 검증 필요 시 추가
    const payload = {
      DCODE: dcode,
      DCODE_NM: dcodeNm,
      ORDER_NO: order,
    };

    try {
      if (isEditMode) {
        // 수정: PUT 요청, URL에 DCODE를 포함
        const response = await axios.put(`${URL}/api/dcode/${dcode}`, payload);
        setMessage('세부분류코드 수정 성공');
      } else {
        // 등록: POST 요청
        const response = await axios.post(`${URL}/api/dcode`, payload);
        setMessage('세부분류코드 등록 성공');
      }
      // 변경 후 부모 컴포넌트에 알려서 목록 새로고침 등 처리
      if (onSave) onSave(payload);
      // 리스트 다시 불러오기 (또는 페이지 리로드 방식)
      const updatedResponse = await axios.get(`${URL}/api/dcode`);
      setDcodeList(updatedResponse.data);
      // 초기화
      setDcode('');
      setDcodeNm('');
      setOrder('');
      setIsEditMode(false);
    } catch (error) {
      console.error('세부분류코드 처리 에러:', error);
      setMessage('오류 발생: ' + error.message);
    }
  };

  // 리스트 항목 선택 시 폼에 값 채우고 수정모드 전환
  const handleDcodeSelect = (item) => {
    setDcode(item.DCODE);
    setDcodeNm(item.DCODE_NM);
    setOrder(item.ORDER_NO);
    setIsEditMode(true);
  };

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <h2>세부분류코드 관리</h2>
        {/* 등록/수정 폼 */}
        <div className="form-group" style={formGroupStyle}>
          <label>세부분류코드 (DCODE)</label>
          <input
            type="text"
            value={dcode}
            onChange={(e) => setDcode(e.target.value)}
            style={inputStyle}
            readOnly={isEditMode} // 수정 시 DCODE는 고정할 수 있음
          />
        </div>
        <div className="form-group" style={formGroupStyle}>
          <label>세부분류코드명 (DCODE_NM)</label>
          <input
            type="text"
            value={dcodeNm}
            onChange={(e) => setDcodeNm(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div className="form-group" style={formGroupStyle}>
          <label>순서 (ORDER_NO)</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div className="button-group" style={buttonGroupStyle}>
          <button onClick={handleSubmit} style={buttonStyle}>
            {isEditMode ? '수정 저장' : '등록'}
          </button>
          <button onClick={onClose} style={buttonStyle}>닫기</button>
        </div>
        {message && <p>{message}</p>}

        <hr style={{ margin: '20px 0' }} />
        {/* 세부분류코드 리스트 */}
        <h3>세부분류코드 리스트</h3>
        {listLoading ? (
          <p>로딩 중...</p>
        ) : listError ? (
          <p>오류 발생: {listError.message}</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>순서</th>
                <th style={thStyle}>코드</th>
                <th style={thStyle}>코드명</th>
              </tr>
            </thead>
            <tbody>
              {dcodeList.map((item) => (
                <tr key={item.DCODE} onClick={() => handleDcodeSelect(item)} style={trStyle}>
                  <td style={tdStyle}>{item.ORDER_NO}</td>
                  <td style={tdStyle}>{item.DCODE}</td>
                  <td style={tdStyle}>{item.DCODE_NM}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* 인라인 스타일 (원하는 경우 별도의 CSS 파일로 분리 가능) */
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const formGroupStyle = {
  marginBottom: '15px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  boxSizing: 'border-box',
};

const buttonGroupStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
};

const buttonStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  borderBottom: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};

const tdStyle = {
  borderBottom: '1px solid #eee',
  padding: '8px',
};

const trStyle = {
  cursor: 'pointer',
};

export default DcodeModal;
