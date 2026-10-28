import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';

const dayLabel = (d) =>
  new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
const timeLabel = (d) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

export default function MovieDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/movies/${id}`).then((r) => setData(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  const grouped = useMemo(() => {
    const out = {};
    (data?.shows || []).forEach((s) => {
      const key = dayLabel(s.startTime);
      (out[key] = out[key] || []).push(s);
    });
    return out;
  }, [data]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <p className="text-secondary">Loading...</p>;
  const { movie } = data;

  return (
    <div className="row g-4">
      <div className="col-md-4 col-lg-3">
        <div className="poster" style={{ background: `linear-gradient(160deg, ${movie.posterColor}, #0b0d12)` }}>
          <span className="poster-title">{movie.title}</span>
        </div>
      </div>
      <div className="col-md-8 col-lg-9">
        <h1 className="h2">{movie.title}</h1>
        <p className="text-secondary">
          {movie.genre} · {movie.language} · {movie.durationMins} min · ★ {movie.rating.toFixed(1)}
        </p>
        <p>{movie.description}</p>

        <h2 className="h5 mt-4 mb-3">Showtimes</h2>
        {Object.keys(grouped).length === 0 && <p className="text-secondary">No upcoming shows for this movie.</p>}
        {Object.entries(grouped).map(([day, shows]) => (
          <div key={day} className="mb-3">
            <div className="text-secondary small mb-2">{day}</div>
            <div className="d-flex flex-wrap gap-2">
              {shows.map((s) => (
                <Link key={s._id} to={`/shows/${s._id}`} className="btn btn-outline-warning showtime">
                  {timeLabel(s.startTime)}
                  <small className="d-block text-secondary">{s.screen} · ₹{s.price}</small>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
