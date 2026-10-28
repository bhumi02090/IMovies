import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      api
        .get('/movies', { params: { search } })
        .then((res) => { setMovies(res.data); setError(''); })
        .catch((e) => setError(errMsg(e)))
        .finally(() => setLoading(false));
    }, 300); // debounce typing
    return () => clearTimeout(t);
  }, [search]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Now showing</h1>
          <p className="text-secondary mb-0">Pick a movie, choose a showtime, grab your seats.</p>
        </div>
        <input
          className="form-control search-box"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p className="text-secondary">Loading movies...</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-secondary">No movies match "{search}". Try a different title.</p>
      )}

      <div className="row g-4">
        {movies.map((m) => (
          <div className="col-6 col-md-4 col-lg-3" key={m._id}>
            <Link to={`/movies/${m._id}`} className="text-decoration-none">
              <div className="poster" style={{ background: `linear-gradient(160deg, ${m.posterColor}, #0b0d12)` }}>
                <span className="poster-rating">★ {m.rating.toFixed(1)}</span>
                <span className="poster-title">{m.title}</span>
              </div>
              <div className="mt-2 text-light fw-semibold">{m.title}</div>
              <div className="text-secondary small">{m.genre} · {m.language}</div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
