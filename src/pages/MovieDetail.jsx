import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { LOGO_IMAGE } from "../constants";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const { movieId } = useParams();

  const [movie, setMovie] = useState({
    title: "",
    posters: LOGO_IMAGE,
    genre: "",
    plot: "",
  });
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 좋아요 리스트
  const [likeList, setLikeList] = useState([]);

  // 찜한 영화 목록 요청 함수
  const getLikeList = async () => {
    try {
      // 찜한 영화 요청 시 불러올 영화 수 50개로 한정
      const serverResponse = await axios.get("/members/list?size=50");
      setLikeList(serverResponse.data.data.content);
    }
    catch (error) {
        console.error("찜한 영화 목록 로딩 실패 : ", error);
    }
  }

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`/movies/${id}`);

        if (response.data.success) {
          const movieData = response.data.data;

          setMovie({
            title: movieData.title || "제목 없음",
            posters: movieData.posterImageUrl || LOGO_IMAGE,
            genre: movieData.genreList?.join(", ") || "장르 정보 없음",
            plot: movieData.plot || "줄거리 정보 없음",
            directors: movieData.directorName?.join(", ") || "감독 정보 없음",
            actors: movieData.castsList?.join(", ") || "출연 정보 없음",
            nation: movieData.nation || "국가 정보 없음",
            releaseDate: movieData.releaseDate || "개봉일 정보 없음",
          });
          setError(null);
        } else {
          throw new Error("영화 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("영화 정보를 불러오는 중 오류가 발생했습니다.");
        setMovie({
          title: "정보 불러오기 실패",
          posters: LOGO_IMAGE,
          genre: "-",
          plot: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
      // 사용자가 찜한 영화 목록 가져옴
      getLikeList();
  }, [])
  
  // likeList에서 현재 영화가 존재하는지 확인하여 isLiked 업데이트
  useEffect(() => {
    if (likeList.length > 0) {
      setIsLiked(likeList.some(movie => movie.movieId === parseInt(id)));
    }
  }, [likeList, id]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/movies/${id}/poster`, {
        responseType: 'blob',
      });
      const blob = response.data;
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${movie.title}_poster.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("다운로드 실패:", error);
      alert("포스터 다운로드에 실패했습니다");
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.patch(`/movies/liked?movieId=${id}`);
      if (response.data.success) {
        setIsLiked(!isLiked);
      } else {
        alert("영화 반응 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating movie like status:", error);
      alert("영화 반응 업데이트 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>⚠️ 오류 발생</h2>
        <p>{error}</p>
        <Link to="/home" className="home-link">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <div className="detail-content">
        <div className="detail-main-content">
          <div className="detail-poster-section">
            <img
              src={movie.posters}
              alt={movie.title}
              className="detail-poster"
              onError={(e) => {
                e.target.src = LOGO_IMAGE;
              }}
            />
          </div>

          <div className="detail-info-section">
            <div className="detail-title-row">
              <h1 className="detail-movie-title">
                {movie.title}{" "}
                {movie.releaseDate && (
                  <span>({movie.releaseDate.slice(0, 4)})</span>
                )}
              </h1>

              <div className="detail-button-group">
                <button className="download-btn" onClick={handleDownload}>
                  📥
                </button>
                <button
                  className={`like-btn ${isLiked ? "liked" : ""}`}
                  onClick={handleLike}
                >
                  {isLiked ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            <div className="movie-info">
              <p>
                <strong>장르:</strong> {" "}
                {movie.genre.split(", ").slice(0, 8).join(", ")}
              </p>
              <p>
                <strong>감독:</strong> {" "}
                {movie.directors.split(", ").slice(0, 10).join(", ")}
              </p>
              <p>
                <strong>출연:</strong>{" "}
                {movie.actors.split(", ").slice(0, 13).join(", ")}
              </p>
            </div>

            <div className="plot-section">
              <h3>줄거리</h3>
              <p>{movie.plot}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
