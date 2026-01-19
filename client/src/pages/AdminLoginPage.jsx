import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminService';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting admin login...');
            const data = await adminService.adminLogin(email, password);
            console.log('Login response:', data);

            // Store admin token
            if (data && data.token) {
                localStorage.setItem('adminToken', data.token);
                console.log('Admin token stored:', data.token);

                // Navigate to admin dashboard
                console.log('Navigating to /admin/dashboard');
                navigate('/admin/dashboard');
            } else {
                console.error('No token in response:', data);
                setError('Login failed: No authentication token received');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100" style={{ marginTop: '-60px' }}>
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="bi bi-shield-lock" style={{ fontSize: '3rem', color: '#007bff' }}></i>
                                <h2 className="fw-bold mt-3">Admin Login</h2>
                                <p className="text-muted">Access the admin dashboard</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Admin Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter admin password"
                                    />
                                </div>

                                <div className="alert alert-info small">
                                    <strong>Default Credentials:</strong><br />
                                    Email: admin@example.com<br />
                                    Password: admin123
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login as Admin'}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <a href="/" className="text-muted">
                                    <i className="bi bi-arrow-left me-2"></i>
                                    Back to Home
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
