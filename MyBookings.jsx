import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();

  const load = () =>
    api.get('/bookings/mine').then((r) => setBookings(r.data)).catch((e) => setError(errMsg(e)));

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setError('');
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <>
      <h1 className="h2 mb-3">My bookings</h1>
      {location.state?.justBooked && <div className="alert alert-success">Booking confirmed. Enjoy the movie!</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!bookings && !error && <p className="text-secondary">Loading...</p>}
      {bookings?.length === 0 && (
        <p className="text-secondary">You have no bookings yet. <Link to="/">Browse movies</Link></p>
      )}

      <div className="d-flex flex-column gap-3">
        {bookings?.map((b) => (
          <div key={b._id} className={`ticket ${b.status === 'cancelled' ? 'cancelled' : ''}`}>
            <div className="ticket-color" style={{ background: b.show?.movie?.posterColor }} />
            <div className="flex-grow-1 p-3">
              <div className="fw-semibold">{b.show?.movie?.title}</div>
              <div className="text-secondary small">
                {b.show && new Date(b.show.startTime).toLocaleString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
                })} · {b.show?.screen}
              </div>
              <div className="mt-1">Seats: <strong>{b.seats.join(', ')}</strong> · ₹{b.totalAmount}</div>
            </div>
            <div className="p-3 text-end">
              <span className={`badge ${b.status === 'confirmed' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                {b.status}
              </span>
              {b.status === 'confirmed' && (
                <div>
                  <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => cancel(b._id)}>
                    Cancel booking
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
