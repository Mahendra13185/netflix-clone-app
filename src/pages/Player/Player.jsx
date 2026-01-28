import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);

  const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;

  useEffect(() => {
    if (!TMDB_BEARER) {
      console.error("TMDB bearer token missing");
      return;
    }

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_BEARER}`,
        },
      }
    )
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(data => {
        const trailer =
          data.results?.find(v => v.site === "YouTube" && v.type === "Trailer") ||
          data.results?.find(v => v.site === "YouTube");

        setVideo(trailer || null);
      })
      .catch(err => {
        console.error("TMDB error:", err);
        setVideo(null);
      });
  }, [id, TMDB_BEARER]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="back"
        className="back-btn"
        onClick={() => navigate(-1)}
      />

      {video ? (
        <>
          <iframe
            width="90%"
            height="90%"
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name}
            frameBorder="0"
            allowFullScreen
          />
          <div className="player-info">
            <p>{video.published_at?.slice(0, 10)}</p>
            <p>{video.name}</p>
            <p>{video.type}</p>
          </div>
        </>
      ) : (
        <h2 style={{ color: "white", marginTop: "20%" }}>
          Trailer not available
        </h2>
      )}
    </div>
  );
};

export default Player;
