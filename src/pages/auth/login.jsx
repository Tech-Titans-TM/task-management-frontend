// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/authContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/home', { replace: true });
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200">
            <div className="w-full max-w-sm shadow-xl bg-base-100 rounded-box p-8">
                <img src={logo} alt="Logo" className="w-1/2 h-auto mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                {error && (
                    <div className="alert alert-error mb-4 py-2">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* email */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* password */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* submit */}
                    <button
                        type="submit"
                        className={`btn btn-primary w-full ${loading && 'btn-disabled'}`}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner" />
                                Logging in…
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                <div className="text-center mt-4">
                    Don't have an account?{' '}
                    <a className="link link-hover text-sm" href="/register">Sign up!</a>
                </div>
            </div>
        </div>
    );
}
