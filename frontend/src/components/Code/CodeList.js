// src/components/Code/CodeList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/CodeList.css';

const URL = process.env.REACT_APP_API_URL; // 예: http://localhost:4000

function CodeList({ onCodeClick }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await axios.get(`${URL}/api/pcode`);
        let data = response.data;
        console.log(response.data);
        if (data && data.rows) {
          data = data.rows;
        }
        
        // 혹은 응답이 객체라면 배열로 감싸기:
        if (!Array.isArray(data)) {
          data = [data];
        }
        setCodes(data);
        setLoading(false);
      } catch (err) {
        console.error('코드 목록 조회 에러:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error.message}</p>;

  return (
    <table className="table">
      <thead>
        <tr>
          <th>NO.</th>
          <th>코드</th>
          <th>코드명</th>
          <th>메뉴</th>
        </tr>
      </thead>
      <tbody>
        {codes.map((code, index) => (
          <tr>
            <td>{index + 1}</td>
            <td key={code.PCODE} onClick={() => onCodeClick && onCodeClick(code)}>{code.PCODE}</td>
            <td>{code.PCODE_NM}</td>
            <td>[세부분류코드]</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CodeList;
