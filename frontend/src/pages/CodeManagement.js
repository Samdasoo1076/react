// src/pages/CodeManagement.js
import React, { useState } from 'react';
import CodeRegisterModal from '../components/pcode_list';
import '../styles/pcode.css';

function CodeManagement() {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (data) => {
    console.log('저장할 데이터:', data);
    // 백엔드 API 호출 등 저장 로직 구현
    setShowModal(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>코드 관리</h1>
      <button onClick={() => setShowModal(true)}>대분류 코드 등록</button>
      {showModal && (
        <CodeRegisterModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
      {/* 코드 목록 등의 추가 UI 구현 */}
    </div>
  );
}

export default CodeManagement;
