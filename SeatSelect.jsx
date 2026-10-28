import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function SeatSelect() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    api.get(`/shows/${id}`).then((r) => setShow(r.data)).catch((e) => setError(errMsg(e)));

  useEffect(() => { load(); }, [id]);

  if (!show) return error ? <div className="alert alert-danger">{error}</div> : <p className="text-secondary">Loading seats...</p>;

  const rows = Array.from({ length: show.rows }, (_, i) => String.fromCharCode(65 + i));
  const cols = Array.from({ length: show.cols }, (_, i) => i + 1);

  const toggle = (seat) => {
    if (show.bookedSeats.includes(seat)) return;
    setError('');
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : prev.length >= 8 ? prev : [...prev, seat]
    );
  };

  const book = async () => {
    setBusy(true);
    setError('');
    try {
      await api.post('/bookings', { showId: id, seats: selected });
      navigate('/bookings', { state: { justBooked: true } });
    } catch (e) {
      setError(errMsg(e));
      setSelected([]);
      load(); // refresh seat map if someone else took a seat
    } finally {
      setBusy(false);
    }
  };

  const when = new Date(show.startTime).toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  });

  return (
    <>
      <h1 className="h3 mb-1">{show.movie.title}</h1>
      <p className="text-secondary">{when} · {show.screen} · ₹{show.price} per seat</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="screen-bar">Screen this way</div>
      <div className="seat-map">
        {rows.map((r) => (
          <div className="seat-row" key={r}>
            <span className="row-label">{r}</span>
            {cols.map((c) => {
              const seat = `${r}${c}`;
              const taken = show.bookedSeats.includes(seat);
              const picked = selected.includes(seat);
              return (
                <button
                  key={seat}
                  type="button"
                  disabled={taken}
                  aria-label={`Seat ${seat}${taken ? ' (taken)' : ''}`}
                  aria-pressed={picked}
                  className={`seat ${taken ? 'taken' : ''} ${picked ? 'picked' : ''}`}
                  onClick={() => toggle(seat)}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="d-flex gap-4 justify-content-center small text-secondary my-3">
        <span><i className="seat-key" /> Available</span>
        <span><i className="seat-key picked" /> Selected</span>
        <span><i className="seat-key taken" /> Taken</span>
      </div>

      <div className="booking-bar">
        <div>
          {selected.length === 0 ? (
            <span className="text-secondary">Select up to 8 seats</span>
          ) : (
            <>
              <strong>{selected.slice().sort().join(', ')}</strong>
              <span className="text-secondary"> · {selected.length} seat{selected.length > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
        <button className="btn btn-warning" disabled={!selected.length || busy} onClick={book}>
          {busy ? 'Booking...' : `Book for ₹${selected.length * show.price}`}
        </button>
      </div>
    </>
  );
}
