import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { errMsg } from '../api';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-card mx-auto">
      <h1 className="h3 mb-3">{isRegister ? 'Create your account' : 'Log in'}</h1>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form onSubmit={submit}>
        {isRegister && (
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Name</label>
            <input id="name" className="form-control" required value={form.name} onChange={set('name')} />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="form-control" required value={form.email} onChange={set('email')} />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="password">Password</label>
          <input id="password" type="password" minLength={6} className="form-control" required value={form.password} onChange={set('password')} />
        </div>
        <button className="btn btn-warning w-100" disabled={busy}>
          {busy ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
        </button>
      </form>
      <p className="text-secondary small mt-3 mb-0">
        {isRegister ? (
          <>Already have an account? <Link to="/login">Log in</Link></>
        ) : (
          <>New to IMovies? <Link to="/register">Create an account</Link></>
        )}
      </p>
    </div>
  );
}
