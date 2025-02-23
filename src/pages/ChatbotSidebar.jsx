import React, { useState } from 'react';
import './ChatbotSidebar.css';

const ChatbotSidebar = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');

    // TODO: 백엔드 API 연동
    try {
      // POST 요청 예시
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ message: inputMessage }),
      // });
      // const data = await response.json();
      
      // 임시 봇 응답
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "죄송합니다. 아직 응답을 연동하지 않았습니다.",
          sender: 'bot'
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={`chatbot-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <div className="user-info">
          <div className="user-avatar">
            <img src="/api/placeholder/40/40" alt="User Avatar" />
          </div>
          <span className="user-name">User Name</span>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="챗봇과 대화를 시작하세요"
          className="message-input"
        />
        <button type="submit" className="send-button">전송</button>
      </form>
    </div>
  );
};

export default ChatbotSidebar;