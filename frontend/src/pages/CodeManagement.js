// src/pages/CodeManagement.js
import React, { useState } from 'react';

import CodeRegisterModal from '../components/Code/pcode_list';
import CodeList from '../components/Code/CodeList';
import CodeDetailModal from '../components/Code/CodeDetailModal';
import DcodeModal from '../components/Code/DecodeModal'; // 세부분류코드 모달
import '../styles/pcode.css';

const URL = process.env.REACT_APP_API_URL; // 예: http://localhost:4000

function CodeManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
const [showDcodeModal, setShowDcodeModal] = useState(false); // 초기값 false로 수정

  const handleRegisterSave = (data) => {
    console.log('새로운 코드 등록됨:', data);
    setShowRegisterModal(false);
    // 필요 시 목록 새로고침 로직 추가
  };
   // 세부분류 코드 셀 클릭 시 호출됨
    const handleDcodeClick = (code) => {
      // 전달받은 code를 이용해서 추가 작업 가능
      setShowDcodeModal(true);
    };

  const handleCodeClick = (code) => {
    setSelectedCode(code);
  };

  const handleUpdateSave = (updatedCode) => {
    console.log('코드 업데이트 완료:', updatedCode);
    setSelectedCode(null);
    // 필요 시 목록 새로고침 로직 추가
  };


  const handleSave = (data) => {
    console.log('저장할 데이터:', data);
    // 백엔드 API 호출 등 저장 로직 구현
    setShowModal(false);
  };

    const handleDcodeSave = (payload) => {
        console.log('세부분류코드 처리 완료:', payload);
        setShowDcodeModal(false);
        // 추가: 목록 새로고침 등 구현 가능
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
      

      <CodeList
      onCodeClick={handleCodeClick}
      onDcodeClick={handleDcodeClick}
      />{selectedCode && (
        <CodeDetailModal
          code={selectedCode}
          onClose={() => setSelectedCode(null)}
          onSave={handleUpdateSave}
        />
      )}
      {showDcodeModal && (
              <DcodeModal
                onClose={() => setShowDcodeModal(false)}
                onSave={handleDcodeSave}
              />
            )}
      {/* 코드 목록 등의 추가 UI 구현 */}
    </div>
  );
}

export default CodeManagement;
