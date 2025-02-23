import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaComments,
  FaUserCircle,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";
import ChatbotSidebar from "../pages/ChatbotSidebar";
import "./Header.css";

const LOGO_IMAGE = "../Logo image.png";

const Header = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleChatbot = () => setIsChatbotOpen(!isChatbotOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <>
      <header className="header">
        {/* 왼쪽: 챗봇 버튼 */}
        <button className="chatbot-btn" onClick={toggleChatbot}>
          <FaComments className="chat-icon" />
        </button>

        {/* 중앙: 로고 + 검색창 + 프로필 아이콘 */}
        <div className="center-content">
          <Link to="/home" className="logo">
            <img src={'./src/assets/cineaiLogo.png'} alt="CineAI Logo" className="logo-image" />
          </Link>
          <div className="search-bar">
            <input
              type="text"
              placeholder="배우, 영화 제목, 키워드를 입력하세요"
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="profile-btn" onClick={toggleProfile}>
            <FaUserCircle className="profile-icon" />
          </button>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item">
                <FaSignOutAlt />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>

        {/* 오른쪽: 로그아웃 버튼 */}
        <div className="logout-container">
          <button className="logout-btn">
            <FaSignOutAlt />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* Header에서만 사이드바 렌더링 */}
      <ChatbotSidebar
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </>
  );
};

export default Header;
