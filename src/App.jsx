import './App.css'
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import LoginCallback from "./pages/LoginCallback";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header"; // 헤더 추가
import Preference from './pages/Preference';
import axios from 'axios';

// 모든 axios 요청에 대해 withCredentials: true를 전역적으로 설정
// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

/* 헤더 숨길 경로 목록 */
const hiddenHeaderPaths = ["/", "/login", "/auth/kakao/callback", "/profile", "/admin", "/preference"];

/* 라우터 설정 추가 */
function Layout() {
  const location = useLocation();
  const shouldHideHeader = hiddenHeaderPaths.includes(location.pathname);
  
  return (
    <>
      { !shouldHideHeader && <Header /> } {/* 특정 경로에서 헤더 숨김 */}
      {/* <div style={{ paddingTop: "60px" }}> 헤더 높이만큼 여백 추가 */}
      <div>
        <Routes>
          <Route path= "/"  element={<Login/>} />
          <Route path= "/login"  element={<Login/>} />
          <Route path= "/auth/kakao/callback"  element={<LoginCallback/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/preference" element={<Preference />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout /> {/* Layout 컴포넌트가 Router 내부에서 실행됨 */}
    </Router>
  );
}

export default App;
