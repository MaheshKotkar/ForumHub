import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import PostCard from '../components/posts/PostCard';
import { postService } from '../services/postService';
import { adminService } from '../services/adminService';
import api from '../services/api';
import '../styles/dashboard.css';

const DashboardPage = () => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [userPosts, setUserPosts] = useState([]);
    const [deletionAlerts, setDeletionAlerts] = useState([]);
    const [profileDeletionAlert, setProfileDeletionAlert] = useState(null);
    const [countdown, setCountdown] = useState(10);
    const [stats, setStats] = useState({ posts: 0, comments: 0, likes: 0, dislikes: 0 });
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Technology',
        privacy: 'public',
        image: null,
        video: null
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchUserPosts();
            fetchDeletionAlerts();
        }
    }, [user]);

    useEffect(() => {
        if (user && activeSection === 'posts') {
            fetchDeletionAlerts();
        }
    }, [activeSection]);

    // Handle profile deletion alert countdown and logout
    useEffect(() => {
        if (profileDeletionAlert && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (profileDeletionAlert && countdown === 0) {
            // Permanently delete account and logout
            api.delete('/auth/complete-deletion')
                .then(() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                })
                .catch(error => {
                    console.error('Error completing deletion:', error);
                    // Force logout even if API fails
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                });
        }
    }, [profileDeletionAlert, countdown]);

    const fetchUserPosts = async () => {
        try {
            const posts = await postService.getUserPosts(user._id);
            setUserPosts(posts);
            setStats({ ...stats, posts: posts.length });
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const fetchDeletionAlerts = async () => {
        try {
            if (user?._id) {
                const alerts = await adminService.getDeletionAlerts(user._id);

                // Separate profile deletion alerts from post deletion alerts
                const profileAlert = alerts.find(alert => alert.type === 'profile');
                const postAlerts = alerts.filter(alert => alert.type === 'post');

                setDeletionAlerts(postAlerts);

                // If profile was deleted, set profile deletion alert
                if (profileAlert) {
                    setProfileDeletionAlert(profileAlert);
                }
            }
        } catch (error) {
            console.error('Error fetching deletion alerts:', error);
        }
    };

    const handleDismissAlert = async (alertId) => {
        try {
            await api.delete(`/admin/alerts/${alertId}`);
            setDeletionAlerts(prev => prev.filter(alert => alert._id !== alertId));
        } catch (error) {
            console.error('Error dismissing alert:', error);
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postFormData = new FormData();
        postFormData.append('title', formData.title);
        postFormData.append('content', formData.content);
        postFormData.append('category', formData.category);
        postFormData.append('privacy', formData.privacy);
        if (formData.image) postFormData.append('image', formData.image);
        if (formData.video) postFormData.append('video', formData.video);

        try {
            await postService.createPost(postFormData);
            setMessage('Post created successfully!');
            setFormData({ title: '', content: '', category: 'Technology', privacy: 'public', image: null, video: null });
            setActiveSection('posts');
            fetchUserPosts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error creating post');
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await postService.deletePost(postId);
                fetchUserPosts();
                setMessage('Post deleted successfully!');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting post');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                {message && (
                    <div className="alert alert-success position-fixed top-0 end-0 m-3" style={{ zIndex: 1050 }}>
                        {message}
                    </div>
                )}

                {/* Profile Deletion Alert Modal */}
                {profileDeletionAlert && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="card shadow-lg" style={{ maxWidth: '500px', width: '90%' }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-4">
                                    <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '4rem' }}></i>
                                </div>
                                <h3 className="card-title text-danger mb-3">Account Deleted</h3>
                                <p className="mb-3">Your account has been deleted by an administrator.</p>
                                <div className="alert alert-warning mb-3">
                                    <strong>Reason:</strong> {profileDeletionAlert.reason}
                                </div>
                                <div className="mb-3">
                                    <h2 className="text-primary">{countdown}</h2>
                                    <small className="text-muted">You will be logged out in {countdown} second{countdown !== 1 ? 's' : ''}</small>
                                </div>
                                <div className="progress" style={{ height: '5px' }}>
                                    <div
                                        className="progress-bar bg-danger"
                                        role="progressbar"
                                        style={{ width: `${(10 - countdown) * 10}%` }}
                                        aria-valuenow={10 - countdown}
                                        aria-valuemin="0"
                                        aria-valuemax="10"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="d-flex flex-column flex-md-row">
                    {/* Sidebar */}
                    <aside className="bg-white shadow-sm dashboard-sidebar" style={{ minHeight: 'calc(100vh - 80px)' }}>
                        <nav className="p-3">
                            <ul className="nav flex-column flex-row flex-md-column gap-2 gap-md-0">
                                <li className="nav-item mb-2 col-4 col-md-12">
                                    <button
                                        className={`btn w-100 text-center text-md-start sidebar-nav-btn ${activeSection === 'profile' ? 'active-btn' : 'text-secondary'}`}
                                        onClick={() => setActiveSection('profile')}
                                    >
                                        <i className="bi bi-person-circle me-md-2 d-block d-md-inline display-6 display-md-6 fs-5"></i>
                                        <span className="small d-block d-md-inline">Profile</span>
                                    </button>
                                </li>
                                <li className="nav-item mb-2 col-4 col-md-12">
                                    <button
                                        className={`btn w-100 text-center text-md-start sidebar-nav-btn ${activeSection === 'posts' ? 'active-btn' : 'text-secondary'}`}
                                        onClick={() => setActiveSection('posts')}
                                    >
                                        <i className="bi bi-file-post me-md-2 d-block d-md-inline fs-5"></i>
                                        <span className="small d-block d-md-inline">My Posts</span>
                                    </button>
                                </li>
                                <li className="nav-item mb-2 col-4 col-md-12">
                                    <button
                                        className={`btn w-100 text-center text-md-start sidebar-nav-btn ${activeSection === 'create' ? 'active-btn' : 'text-secondary'}`}
                                        onClick={() => setActiveSection('create')}
                                    >
                                        <i className="bi bi-plus-circle me-md-2 d-block d-md-inline fs-5"></i>
                                        <span className="small d-block d-md-inline">Create Post</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-grow-1 p-3 p-md-4">
                        {/* Profile Section */}
                        {activeSection === 'profile' && (
                            <div className="card shadow-sm">
                                <div className="card-body p-5">
                                    <h2 className="text-center mb-3 welcome-text-animated fw-bold">{user?.fullName}, Welcome to ForumHub!</h2>
                                    <p className="text-center welcome-subtitle lead mb-5">"Connect, Share, and Grow Together."</p>

                                    <div className="row g-4">
                                        <div className="col-md-6 animate-fade-in-up stagger-1">
                                            <div className="card h-100 professional-card">
                                                <div className="card-body">
                                                    <h5 className="card-title text-primary"><i className="bi bi-person-lines-fill me-2"></i>Personal Information</h5>
                                                    <div className="mt-3">
                                                        <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
                                                        <p className="mb-2"><strong>Username:</strong> @{user?.username}</p>
                                                        <p className="mb-0"><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 animate-fade-in-up stagger-2">
                                            <div className="card h-100 professional-card">
                                                <div className="card-body">
                                                    <h5 className="card-title text-primary"><i className="bi bi-bar-chart-line me-2"></i>Activity Statistics</h5>
                                                    <div className="row text-center">
                                                        <div className="col-6 mb-3">
                                                            <div className="display-6 text-primary">{stats.posts}</div>
                                                            <small className="text-muted">Total Posts</small>
                                                        </div>
                                                        <div className="col-6 mb-3">
                                                            <div className="display-6 text-info">{stats.comments}</div>
                                                            <small className="text-muted">Comments</small>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="display-6 text-success">{stats.likes}</div>
                                                            <small className="text-muted">Likes</small>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="display-6 text-danger">{stats.dislikes}</div>
                                                            <small className="text-muted">Dislikes</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posts Section */}
                        {activeSection === 'posts' && (
                            <div>
                                <h3 className="mb-4">Your Posts</h3>

                                {/* Deletion Alerts */}
                                {deletionAlerts.length > 0 && deletionAlerts.filter(alert => alert.type === 'post').map((alert) => (
                                    <div key={alert._id} className="alert alert-warning alert-dismissible fade show mb-3" role="alert">
                                        <div className="d-flex align-items-start">
                                            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                                            <div className="flex-grow-1">
                                                <h6 className="alert-heading mb-1">Post Deleted by Admin</h6>
                                                <p className="mb-1"><strong>Post Title:</strong> {alert.content || 'N/A'}</p>
                                                <p className="mb-0"><strong>Reason:</strong> {alert.reason}</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => handleDismissAlert(alert._id)}
                                                aria-label="Close"
                                            ></button>
                                        </div>
                                    </div>
                                ))}

                                {userPosts.length > 0 ? (
                                    <div className="posts-grid">
                                        {userPosts.map(post => (
                                            <div key={post._id} className="animate-fade-in-up professional-card-wrapper h-100">
                                                <PostCard post={post} showActions={true} onDelete={handleDeletePost} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="alert alert-info">You haven't created any posts yet.</div>
                                )}
                            </div>
                        )}

                        {/* Create Post Section */}
                        {activeSection === 'create' && (
                            <div className="card shadow-sm">
                                <div className="card-body p-4">
                                    <h3 className="mb-4">Create New Post</h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Post Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="content" className="form-label">Post Content</label>
                                            <textarea
                                                className="form-control"
                                                id="content"
                                                rows="5"
                                                value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <select
                                                className="form-select"
                                                id="category"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="Technology">Technology</option>
                                                <option value="Education">Education</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Lifestyle">Lifestyle</option>
                                                <option value="Health">Health</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">Image (optional)</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="image"
                                                name="image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="video" className="form-label">Video (optional)</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="video"
                                                name="video"
                                                accept="video/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Privacy</label>
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="privacy"
                                                        id="public"
                                                        value="public"
                                                        checked={formData.privacy === 'public'}
                                                        onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                                                    />
                                                    <label className="form-check-label" htmlFor="public">Public</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="privacy"
                                                        id="private"
                                                        value="private"
                                                        checked={formData.privacy === 'private'}
                                                        onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                                                    />
                                                    <label className="form-check-label" htmlFor="private">Private</label>
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn btn-primary w-100">Create Post</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
