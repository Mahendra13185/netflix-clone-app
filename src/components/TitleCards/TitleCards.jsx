import React, { useRef, useEffect, useState } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    if (!TMDB_BEARER) {
      console.error("TMDB bearer token missing");
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/movie/${category || "now_playing"}?language=en-US&page=1`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => setApiData(data.results || []))
      .catch((err) => console.error("TMDB error:", err));

    const ref = cardsRef.current;
    ref.addEventListener("wheel", handleWheel);

    return () => ref.removeEventListener("wheel", handleWheel);
  }, [category, TMDB_BEARER]);

  return (
    <div className="title-cards">
      <h2>{title || "Popular on Netflix"}</h2>

      <div className="card-list" ref={cardsRef}>
        {apiData.map((card) => (
          <Link to={`/player/${card.id}`} className="card" key={card.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
              alt={card.original_title}
            />
            <p>{card.original_title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
