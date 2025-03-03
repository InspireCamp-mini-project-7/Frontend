import React, { useEffect, useState } from 'react'
import './Preference.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const Preference = () => {
    // 영화 리스트 저장
    const [movieList, setMovieList] = useState([]);

    // 사용자가 선택한 영화 ID 배열
    const [selectedMovieIds, setSelectedMovieIds] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    
    const navigate = useNavigate();
    
    const imagePath = import.meta.env.VITE_IMAGE_PATH;

    // 마운트 될 때 영화 목록 추출 함수 호출
    useEffect(() => {
        getInitMovies();
    }, []);

    // 서버로부터 영화 목록 추출
    const getInitMovies = async () => {
        try {
            setIsLoading(true);
            
            const serverResponse = await axios.get('/movies/init?size=8');
            setMovieList(serverResponse.data.data);
        }
        catch (error) {
            console.error("영화 목록 로딩 실패 : ", error);
        }
        finally {
            setIsLoading(false);
        }
    } 

    // 선호 영화 선택/해제 처리 함수
    const handleSelectMovie = movieId => {
        setSelectedMovieIds(prevList => {
            // 이미 선택되어 있으면 해제
            if(prevList.includes(movieId)) 
                return prevList.filter(id => id !== movieId);

            // 선택되어 있지 않으면 추가
            return [...prevList, movieId];
        });
    };

    // 선택 영화 목록을 서버로 전송
    const handleSubmit = async () => {
        // 무조건 영화 선택해야 다음 화면 넘어갈 수 있도록 설정
        if(selectedMovieIds.length > 0){
            try {
                // 여러 영화 ID를 각각 PATCH 호출
                await Promise.all(
                    selectedMovieIds.map(movieId => {
                        axios.patch(`/movies/liked?movieId=${movieId}`)
                    })
                );
    
                Swal.fire({
                    icon: 'success',
                    title: '영화 선택 완료 !',
                    text: '선택한 영화가 성공적으로 저장되었습니다.'
                })
    
                // 영화 Id 전송 성공 시, home으로 이동
                navigate('/home');
            }
            catch (error) {
                console.error('선택한 영화 전송 실패 : ', error);
            }
        }
        else {
            Swal.fire({
                icon: "warning",
                title: "영화 선택 필수 !",
                text: "영화를 하나 이상 선택하세요.",
            });
            return;
        } 
    }

    return (
        <section className='preference-container'>
            <h1 className='preference-text'>선호 영화 선택</h1>
            <div className="preference-movies-section"> 
                {
                         isLoading && (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>영화 목록을 불러오는 중...</p>
                            </div>
                        )
                }   
                <div className="preference-movies-grid">                     
                    {
                        !isLoading && (
                            movieList.map(movie => (
                                <div 
                                    className='preference-movie-card' 
                                    id={`${selectedMovieIds.includes(movie.movieId) ? 'selected' : ''}`}                                        key={movie.movieId} 
                                    onClick={() => handleSelectMovie(movie.movieId)}>
        
                                    <img 
                                        className='preference-movie-poster' 
                                        src={movie.posterImageUrl}
                                        alt={movie.title}/>
        
                                    {/* 영화 선택 시, 하트 이미지 오버레이 */}
                                    { 
                                        selectedMovieIds.includes(movie.movieId) && (
                                            <img
                                                className='preference-movie-overlay'
                                                src={`${imagePath}/checkIcon.png`}
                                                alt='overlay image' />
                                        )
                                    }
                                    <div className='preference-movie-title'> {movie.title} </div>
                                </div>
                                ))
                            )
                        }
                        
                </div>
                <button className='preference-sumbit-button' onClick={handleSubmit}>제출</button>
            </div>
        </section>
    )
}

export default Preference