import React from 'react'
import './Login.css'

const Login = () => {
    /* 카카오 로그인 접속 */
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=dd30bf01e82d03f8cdae72dccd634374&redirect_uri=http://localhost:5173/auth/kakao/callback&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = kakaoAuthUrl;
    };
    
    return (
        <section className='login-container'>
            <img className='login-logo' src='../src/assets/cineaiLogo.png'/>        
            <button className='login-button' onClick={handleKakaoLogin}>
                <img className='login-icon' src='../src/assets/kakaoIcon.png'/>
                <div className='login-text'>카카오 계정 로그인</div>                 
            </button>
        </section>
    )
}

export default Login