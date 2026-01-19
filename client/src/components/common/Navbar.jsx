import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top fh-navbar" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/assets/logo2.jpg" alt="ForumHub Logo" className="logo-img" height="60px" style={{ borderRadius: '50%', border: '2px solid #00aaff' }} />
                        <span className="logo-text" style={{
                            color: '#007bff',
                            fontSize: '26px',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}>ForumHub</span>
                    </div>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={{ color: '#555' }}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/#posts" style={{ color: '#555' }}>Posts</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/#feedback" style={{ color: '#555' }}>Feedback</a>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard" style={{ color: '#555' }}>Profile</Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                            </>
                        ) : (
                            <>
                                <span className="text-muted me-3">Welcome, {user?.fullName || user?.username}!</span>
                                <button onClick={handleLogout} className="btn btn-outline-secondary">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
