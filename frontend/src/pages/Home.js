import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드: http://localhost:4000
    // API: http://localhost:4000/api/posts
    // 프록시 설정이 없다면 절대경로로 작성:
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts`)
      .then(response => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('글 목록 불러오기 에러:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>글 목록</h1>
      {posts.length === 0 ? (
        <p>등록된 글이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '20px', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
              <h2>{post.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: post.content_html }}
                style={{ color: '#ccc' }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
