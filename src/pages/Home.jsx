import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_KEY, BASE_URL, PLACEHOLDER_IMAGE, LOGO_IMAGE } from "../constants";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL, {
        params: {
          collection: "kmdb_new2",
          ServiceKey: API_KEY,
          type: "극영화",
          listCount: 500,
          sort: "prodYear,1",
          releaseDts: "20100101",
          releaseDte: "20251231",
        },
      });

      const results = response.data.Data?.[0]?.Result || [];
      setMovies(results);
      console.log("전체 영화 수:", results.length);
    } catch (error) {
      console.error("영화 정보를 불러오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }

  };

  const getPosterUrl = (posters) => {
    if (!posters) return null;
    const firstPoster = posters.split("|")[0];
    return firstPoster.startsWith("http")
      ? firstPoster
      : `http://${firstPoster}`;
  };

  const hasValidPoster = (movie) => {
    const posterUrl = getPosterUrl(movie.posters);
    return posterUrl && posterUrl !== PLACEHOLDER_IMAGE;
  };

  const filterAdultMovies = (movies) => {
    return movies.filter((movie) => !movie.rating.includes("관람불가"));
  };

  const getRandomMovies = (movies, count) => {
    const validMovies = filterAdultMovies(movies).filter((movie) =>
      hasValidPoster(movie)
    );
    const shuffled = [...validMovies].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getUpcomingMovies = (movies, count) => {
    const today = new Date();
    const moviesWithReleaseDate = movies.filter((movie) => movie.repRlsDate);
    const futureMovies = moviesWithReleaseDate.filter((movie) => {
      const releaseDate = new Date(
        movie.repRlsDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")
      );
      return releaseDate > today;
    });
    
    const moviesWithPosters = futureMovies.filter((movie) =>
      hasValidPoster(movie)
    );

    return moviesWithPosters
      .sort((a, b) =>
        new Date(a.repRlsDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")) -
        new Date(b.repRlsDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"))
      )
      .slice(0, count);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>영화 정보를 불러오는 중...</p>
      </div>
    );
  }

  const randomMovies = getRandomMovies(movies, 4);
  const upcomingMovies = getUpcomingMovies(movies, 4);

  return (
    <div className="main-container">
      <h1 className="main-title">영화 추천 목록</h1>

      <div className="movies-section">
        <h2>맞춤 영화 추천</h2>
        <div className="movies-grid">
          {randomMovies.map((movie) => (
            <div key={movie.movieSeq} className="movie-card">
              <Link to={`/movie/${movie.movieSeq}`}>
                <img
                  src={getPosterUrl(movie.posters)}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = LOGO_IMAGE;
                  }}
                />
                {/* <h2 className="movie-title">{movie.title || "제목 없음"}</h2> */}
              </Link>
              <div className="movie-title">{movie.title || "제목 없음"}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="movies-section">
        <h2>개봉 예정 영화</h2>
        <div className="movies-grid">
          {upcomingMovies.map((movie) => (
            <div key={movie.movieSeq} className="movie-card">
              <Link to={`/movie/${movie.movieSeq}`}>
                <img
                  src={getPosterUrl(movie.posters)}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => {
                    e.target.src = LOGO_IMAGE;
                  }}
                />
                {/* <h2 className="movie-title">{movie.title || "제목 없음"}</h2> */}
              </Link>
              <div className="movie-title">{movie.title || "제목 없음"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;