import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [movie, setMovie] = useState("");
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // ⭐ loading only for default movies
  const [defaultLoading, setDefaultLoading] = useState(true);

  // Load default movies when app starts
  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  // Fetch mixed movies (Hollywood + Indian + Kannada)
  const fetchDefaultMovies = async () => {
    setDefaultLoading(true);

    const keywords = ["Avengers", "Batman", "KGF", "RRR", "Kantara"];
    let allMovies = [];

    for (let key of keywords) {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${key}&apikey=396a46e3`
      );

      const data = await response.json();

      if (data.Search) {
        allMovies = [...allMovies, ...data.Search];
      }
    }

    setMovies(allMovies);
    setDefaultLoading(false);
  };

  // Search movie (no loading message here)
  const searchMovie = async () => {
    if (!movie) return;

    const response = await fetch(
      `https://www.omdbapi.com/?s=${movie}&apikey=396a46e3`
    );

    const data = await response.json();

    if (data.Search) {
      setMovies(data.Search);
      setShowFavorites(false);
    } else {
      alert("Movie not found");
      setMovies([]);
    }
  };

  // Add favorite
  const addFavorite = (m) => {
    if (!favorites.find((fav) => fav.imdbID === m.imdbID)) {
      setFavorites([...favorites, m]);
    }
  };

  // Remove favorite
  const removeFavorite = (id) => {
    setFavorites(favorites.filter((f) => f.imdbID !== id));
  };

  // Check favorite
  const isFavorite = (id) => {
    return favorites.some((fav) => fav.imdbID === id);
  };

  return (
    <div className="container text-center mt-4" style={{ maxWidth: "1100px" }}>
      
     {/* Header */}
<h1 className="mb-2">🎬 WEL-COME TO Movie Explorer</h1>

<p style={{ color: "#aaa" }}>
  Search and manage your favorite movies
</p>

<p style={{ color: "#888", fontSize: "14px" }}>
  Created by <b>Ashwath M N</b>
</p>


      {/* Navigation */}
      <div className="mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setShowFavorites(false)}
        >
          🔍 Search Movies
        </button>

        <button
          className="btn btn-warning"
          onClick={() => setShowFavorites(true)}
        >
          ⭐ Favorites ({favorites.length})
        </button>
      </div>

      {/* SEARCH PAGE */}
      {!showFavorites && (
        <>
          <div className="input-group mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search movie..."
              onChange={(e) => setMovie(e.target.value)}
            />
            <button className="btn btn-success" onClick={searchMovie}>
              Search
            </button>
          </div>

          {/* ⭐ Loading only for default movies */}
          {defaultLoading ? (
            <h3>Loading movies...</h3>
          ) : (
            <div className="row">
              {movies.map((m) => (
                <div className="col-md-3 mb-4" key={m.imdbID}>
                  <div className="card">

                    {/* Image fallback */}
                    <img
                      src={m.Poster}
                      className="card-img-top"
                      alt="movie"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x450?text=No+Image";
                      }}
                    />

                    <div className="card-body">
                      <h5>{m.Title}</h5>
                      <p>{m.Year}</p>

                      {isFavorite(m.imdbID) ? (
                        <button className="btn btn-secondary" disabled>
                          ✅ Added
                        </button>
                      ) : (
                        <button
                          className="fav-btn"
                          onClick={() => addFavorite(m)}
                        >
                          ❤️ Add to Favorite
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FAVORITES PAGE */}
      {showFavorites && (
        <>
          <h2 className="mb-4">⭐ Your Favorite Movies</h2>

          {favorites.length === 0 && <p>No favorite movies yet.</p>}

          <div className="row">
            {favorites.map((f) => (
              <div className="col-md-3 mb-4" key={f.imdbID}>
                <div className="card">
                  <img
                    src={f.Poster}
                    className="card-img-top"
                    alt="movie"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x450?text=No+Image";
                    }}
                  />

                  <div className="card-body">
                    <h5>{f.Title}</h5>
                    <p>{f.Year}</p>

                    <button
                      className="remove-btn"
                      onClick={() => removeFavorite(f.imdbID)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
