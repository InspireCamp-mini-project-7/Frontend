import React, { useState, useEffect } from 'react'
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const Profile = () => {

    const navigate = useNavigate();

    // 현재 탭 저장 상태 변수
    const [activeTab, setActiveTab] = useState("account");

    // 닉네임 수정 아이콘 클릭 상태 저장 변수
    const [clickNickname, setclickNickname] = useState(false);

    // 현재 닉네임 저장 상태 변수
    const [nickname, setNickname] = useState("");

    // 서버에서 받은 데이터 저장 상태 변수
    const [userInfo, setUserInfo] = useState(null);
    const [likeList, setLikeList] = useState([]);

    // 탭 변경 함수
    const handleTabChange = tab => setActiveTab(tab);

    // 닉네임 수정 아이콘 클릭 여부 변경 함수
    const handleNicknameClick = () => setclickNickname(!clickNickname);

    // Bearer Token 가져오기
    const token = sessionStorage.getItem("accessToken");
    console.log("profile token : ", token);

    // activeTab 변경될 때만 useEffect 호출
    useEffect(() => {
        // 현재 탭이 account인 경우, 사용자 정보 불러옴
        if(activeTab === 'account')
            getUserInfo();
        // 현재 탭이 preference인 경우, 사용자 찜 목록 불러옴
        else if(activeTab === 'preference')
            getLikeList();
    }, [activeTab])

    // 닉네임 수정 버튼 클릭 시 실행 함수
    const updateNickname = async () => {
        if(!nickname.trim()) {
            Swal.fire({
                icon: "warning",
                title: "닉네임 입력 필수 !",
                text: "닉네임을 입력하세요.",
            });
            return;
        }
            
        // nickname 값이 null이 아니면 수정 요청
        try { 
            const serverResponse = await axios.patch("http://localhost:8080/members/me/edit", 
                { nickname });
    
            // 닉네임 변경 요청 성공 시
            if(serverResponse.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "닉네임 변경 성공 !",
                    text: "닉네임을 성공적으로 변경하였습니다."
                });
                // 닉네임 입력 창 닫기
                setclickNickname(false);
                // 닉네임 변경 후, 다시 사용자 정보 불러옴
                getUserInfo();
                // 입력창 리셋
                setNickname("");
            }
        }
        catch (error) {
            console.error("닉네임 변경 실패 : ", error);
        }  
    }

    // 사용자 정보 요청 함수
    const getUserInfo = async () => {
        try {
            const serverResponse = await axios.get("http://localhost:8080/members/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(serverResponse.data.success)
                setUserInfo(serverResponse.data.data);
        }
        catch (error) {
            console.error("회원 정보 로딩 실패 : ", error);
        } 
    }

    // 찜한 영화 목록 요청 함수
    const getLikeList = async () => {
        try {
            const serverResponse = await axios.get("http://localhost:8080/members/list");
            setLikeList(serverResponse.data);
        }
        catch (error) {
            console.error("찜한 영화 목록 로딩 실패 : ", error);
        }
    }

    // 홈페이지 이동 함수
    const moveToHome = () => {
        navigate("/home");
    }
    
    // 회원 탈퇴 함수
    const deleteUser = async () => {
        const result = await Swal.fire({
            title: "정말 탈퇴하시겠습니까?",
            text: "탈퇴 후 계정 복구가 불가능합니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "네, 탈퇴할래요",
            cancelButtonText: "취소"
        });

        if(result.isConfirmed) {
            try {
                await axios.delete("http://localhost:8080/members/withdrawal", {
                    headers: {
                       Authorization: `Bearer ${token}`
                    }
                });
    
                // 회원 탈퇴 시, 로컬 스토리지에서 토큰 삭제 후 로그인 페이지로 이동
                sessionStorage.removeItem("accessToken");
                navigate('/');
            }
            catch (error) {
                console.error("회원 탈퇴 실패 : ", error);
            } 
        }
    }

    return (
        <section className='profile-container'>
            <header className='profile-header'>
                <img className='profile-homeIcon' src='./src/assets/homeIcon.png' onClick={moveToHome}></img>
                <div className='profile-headerText'>회원 정보 관리</div>
            </header>
            <main className='profile-main'>
                <aside className='profile-sidebar'>
                    <ul>
                        <li className={activeTab === 'account' ? 'active' : ''}
                            onClick={() => handleTabChange('account')}>
                            <img src='./src/assets/keyIcon.png'/>
                            <div>계정 정보</div>
                        </li>
                        <li className={activeTab === 'preference' ? 'active' : ''}
                            onClick={() => handleTabChange('preference')}>
                            <img src='./src/assets/heartIcon.png'/>
                            <div>영화 찜 목록</div>
                        </li>
                    </ul>
                </aside>

                <section className='profile-content'>
                    {activeTab === 'account' && (
                        <>
                            <h2>계정 정보</h2>
                            {userInfo && (
                                <div className='profile-account'>
                                    <div><strong>닉네임</strong></div>
                                    <div>{userInfo.nickName}</div>
                                    <img className='profile-editIcon' src='./src/assets/editIcon.png'
                                         onClick={() => handleNicknameClick(!clickNickname)}/><br />
                                        {clickNickname ? (
                                            <>
                                                <div><strong>닉네임 변경</strong></div>
                                                <input className='profile-editNickname' type='text' value={nickname} onChange={e => setNickname(e.target.value)}/>
                                                <button className='profile-editButton' onClick={updateNickname}>수정</button><br /> 
                                            </>    
                                            ) : (<></>)
                                        }
                                    <div><strong>이메일</strong></div> 
                                    <div>{userInfo.email}</div>
                                    <button className='profile-deleteButton' onClick={deleteUser}>회원 탈퇴</button>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'preference' && (
                        <div className='profile-preference'>
                            <h2>찜한 영화 목록</h2>
                            <ul>
                                {likeList.length > 0 ? (
                                        likeList.map((movie, index) => (
                                            <li key={index}> {movie.title} </li>
                                        ))
                                    ) 
                                    : (
                                        <p>찜한 영화가 존재하지 않습니다.</p>
                                    )
                                }
                            </ul>
                        </div>    
                    )}
                </section>
            </main>
        </section>
    )
}

export default Profile