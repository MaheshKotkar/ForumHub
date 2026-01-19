import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: '#ffffff',
            padding: '3rem 0 1rem'
        }}>
            <div className="container">
                <div className="row g-4">
                    {/* ForumHub Brand Section */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>ForumHub</h5>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>
                            A vibrant community where knowledge meets passion. Join thousands of members discussing topics that matter.
                        </p>
                        {/* Newsletter */}
                        <div className="mt-3">
                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Your email address"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#ffffff',
                                    borderRadius: '8px'
                                }}
                            />
                            <button
                                className="btn w-100"
                                style={{
                                    background: 'linear-gradient(90deg, #00d4ff 0%, #0099cc 100%)',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                                    Home
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/#posts" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                                    Posts
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/#feedback" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                                    Feedback
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/login" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                                    Login
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/signup" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '0.7rem' }}></i>
                                    Signup
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Categories</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/?category=Technology" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-tag me-2"></i>Technology
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/?category=Education" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-tag me-2"></i>Education
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/?category=Entertainment" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-tag me-2"></i>Entertainment
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/?category=Lifestyle" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-tag me-2"></i>Lifestyle
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/?category=Health" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8 }}>
                                    <i className="bi bi-tag me-2"></i>Health
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect With Us */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Connect With Us</h5>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            Join our community on social media for the latest updates and discussions.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="row mt-4 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="col-12 text-center">
                        <p className="mb-0" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                            © 2025 ForumHub. All rights reserved. |
                            <a href="#" style={{ color: '#00d4ff', textDecoration: 'none', marginLeft: '0.5rem' }}>Privacy Policy</a> |
                            <a href="#" style={{ color: '#00d4ff', textDecoration: 'none', marginLeft: '0.5rem' }}>Terms of Service</a>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .social-icon:hover {
          background: rgba(0, 212, 255, 0.3) !important;
          transform: translateY(-3px);
        }
        
        footer a:hover {
          opacity: 1 !important;
          color: #00d4ff !important;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
