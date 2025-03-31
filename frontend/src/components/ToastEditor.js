// src/components/ToastEditor.js
import React, { useRef, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';

function ToastEditor() {
  const editorRef = useRef(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editorRef.current) return;
    const instance = editorRef.current.getInstance();
    const markdown = instance.getMarkdown();  // 마크다운 원본
    const html = instance.getHTML();          // HTML 변환본

    try {
      await axios.post('/api/posts', {
        title,
        content_md: markdown,
        content_html: html,
      });
      alert('글이 저장되었습니다!');
      // 초기화
      setTitle('');
      instance.setMarkdown('');
    } catch (err) {
      console.error(err);
      alert('글 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>새 글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>제목</label><br />
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <Editor
          ref={editorRef}
          initialValue=""
          initialEditType="markdown" // 'markdown' 또는 'wysiwyg'
          previewStyle="vertical"
          height="500px"
          usageStatistics={false}
          hooks={{
            addImageBlobHook: async (blob, callback) => {
              // FormData 생성
              const formData = new FormData();
              formData.append('file', blob);
              try {
                // 백엔드의 이미지 업로드 API 호출 (예: /api/upload)
                const response = await axios.post('http://localhost:4000/api/upload', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                // 업로드가 성공하면, 반환된 이미지 URL을 에디터에 삽입
                callback(response.data.url, '이미지');
              } catch (error) {
                console.error('이미지 업로드 실패:', error);
                alert('이미지 업로드 중 오류가 발생했습니다.');
              }
            },
          }}
        />
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>
          저장
        </button>
      </form>
    </div>
  );
}

export default ToastEditor;
