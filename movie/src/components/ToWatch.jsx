import React, { useEffect, useState } from "react";
import "./ToWatch.css";
import axios from "axios";

const API_KEY = "15e2a5f942912e28e8c5d6b8e9d1c9ce";
const BASE_URL = "https://api.themoviedb.org/3";

const genres = [
  { id: 0, name: "전체" },
  { id: 28, name: "액션" },
  { id: 35, name: "코미디" },
  { id: 18, name: "드라마" },
  { id: 27, name: "공포" },
  { id: 10749, name: "로맨스" },
  { id: 53, name: "스릴러" },
  { id: 16, name: "애니메이션" },
];

export default function ToWatch() {
  // 영화 데이터 상태
  const [movies, setMovies] = useState([]);

  // 선택된 장르 상태 (0은 전체)
  const [selectedGenre, setSelectedGenre] = useState(0);

  // 랜덤 새로고침용 키 (같은 장르 다시 클릭 시 업데이트)
  const [reloadKey, setReloadKey] = useState(0);

  // TMDB API로 영화 데이터를 불러오는 함수
  //genre = 장르
  async function fetchMovies(genreId) {
    try {
      const page = Math.floor(Math.random() * 10 + 1);

      const url =
        genreId === 0
          ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&page=${page}`
          : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}&page=${page}`;

      const res = await axios.get(url);

      // 결과 중 6개만 랜덤하게 추출
      const random6 = res.data.results
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);

      setMovies(random6);
    } catch (error) {
      console.error("영화 불러오기 실패:", error);
    }
  }

  // 선택된 장르나 reloadKey가 변경될 때마다 영화 새로 불러오기
  useEffect(() => {
    fetchMovies(selectedGenre);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // fetchMovies를 의존성에 포함하면 매 렌더마다 재호출되어 무한 루프가 생김. 한 번만 실행되면 충분해서 검사 제외.
  }, [selectedGenre, reloadKey]);

  // 새로고침 버튼 혹은 동일 장르 클릭 시 호출
  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  // 장르 버튼 클릭 시 실행
  const handleGenreClick = (genreId) => {
    if (selectedGenre === genreId) {
      // 같은 장르 다시 클릭 시 새로고침
      handleRefresh();
    } else {
      // 다른 장르 클릭 시 해당 장르로 변경
      setSelectedGenre(genreId);
    }
  };

  return (
    <section id="towatch">
      <div className="towatch-container">
        <h1>오늘 뭐 보지?</h1>
        <h2>오늘의 추천</h2>

        {/* 장르 버튼 영역 */}
        <div className="genre-buttons">
          {genres.map((g) => (
            <button
              key={g.id}
              className={selectedGenre === g.id ? "active" : ""}
              onClick={() => handleGenreClick(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* 영화 카드 목록 */}
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
              <p>⭐ {movie.vote_average.toFixed(1)} / 10</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
