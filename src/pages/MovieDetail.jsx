import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_KEY, BASE_URL, PLACEHOLDER_IMAGE, LOGO_IMAGE } from "../constants";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState({
    title: "",
    posters: LOGO_IMAGE,
    genre: "",
    audiAcc: 0,
    plot: "",
  });
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPosterUrl = (posters) => {
    if (!posters) return null;
    const firstPoster = posters.split("|")[0];
    return firstPoster?.startsWith("http")
      ? firstPoster
      : `http://${firstPoster}`;
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(BASE_URL, {
          params: {
            collection: "kmdb_new2",
            ServiceKey: API_KEY,
            movieSeq: id,
            type: "극영화",
            detail: "Y",
          },
        });

        console.log("API 응답:", response.data);

        const resultData = response.data?.Data?.[0]?.Result?.[0];
        if (resultData) {
          setMovie({
            title: resultData.title || "제목 없음",
            posters: getPosterUrl(resultData.posters) || LOGO_IMAGE,
            genre: resultData.genre?.replace(/\|/g, ", ") || "장르 정보 없음",
            audiAcc: resultData.audiAcc || 0, //누적 관객수 고치기
            plot: resultData.plot || "줄거리 정보가 없습니다.",
            directors:
              resultData.directors?.director?.[0]?.directorNm || "정보 없음",
            actors:
              resultData.actors?.actor
                ?.slice(0, 3)
                .map((a) => a.actorNm)
                .join(", ") || "정보 없음",
            runtime: resultData.runtime || "정보 없음",
            rating: resultData.rating || "정보 없음",
            repRlsDate: resultData.repRlsDate || "정보 없음",
            nation: resultData.nation || "정보 없음",
            company: resultData.company || "정보 없음",
          });
          setError(null);
        } else {
          throw new Error("영화 정보를 찾을 수 없습니다");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError(error.message);
        setMovie({
          title: "정보 불러오기 실패",
          posters: LOGO_IMAGE,
          genre: "-",
          audiAcc: 0,
          plot: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleDownload = () => {
    const posterUrl = getPosterUrl(movie.posters);
    if (!posterUrl || posterUrl === LOGO_IMAGE) {
      alert("다운로드 가능한 포스터가 없습니다");
      return;
    }

    fetch(`https://cors-anywhere.herokuapp.com/${posterUrl}`)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${movie.title}_poster.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("다운로드 실패:", error);
        alert("포스터 다운로드에 실패했습니다");
      });
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
                {movie.title}
                {movie.repRlsDate && (
                  <span> ({movie.repRlsDate.slice(0, 4)})</span>
                )}
              </h1>
              <div className="detail-button-group">
                <button className="download-btn" onClick={handleDownload}>
                  📥
                </button>
                <button
                  className={`like-btn ${isLiked ? "liked" : ""}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  {isLiked ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            <div className="movie-info">
              <p>
                <strong>장르:</strong> {movie.genre}
              </p>
              <p>
                <strong>감독:</strong> {movie.directors}
              </p>
              <p>
                <strong>출연:</strong> {movie.actors}
              </p>
              {/*<p><strong>제작국가:</strong> {movie.nation}</p>
              <p><strong>제작사:</strong> {movie.company}</p>
              <p><strong>상영시간:</strong> {movie.runtime}분</p>
              <p><strong>등급:</strong> {movie.rating}</p>
              <p><strong>개봉일:</strong> {movie.repRlsDate?.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}</p>*/}
              <p>
                <strong>누적 관객수:</strong>{" "}
                {movie.audiAcc
                  ? Number(movie.audiAcc).toLocaleString()
                  : "정보 없음"}
                명
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
