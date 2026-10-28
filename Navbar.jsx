import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand border-bottom border-secondary-subtle imovies-nav">
      <div className="container">
        <Link to="/" className="navbar-brand brand">IMovies</Link>
        <div className="navbar-nav me-auto">
          <NavLink to="/" end className="nav-link">Movies</NavLink>
          {user && <NavLink to="/bookings" className="nav-link">My bookings</NavLink>}
        </div>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <span className="text-secondary small d-none d-sm-inline">Hi, {user.name}</span>
              <button className="btn btn-sm btn-outline-light" onClick={() => { logout(); navigate('/'); }}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline-light">Log in</Link>
              <Link to="/register" className="btn btn-sm btn-warning">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
