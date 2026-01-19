import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/admin.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { adminService } from '../services/adminService';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { feedbackService } from '../services/feedbackService';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [adminEmail, setAdminEmail] = useState('admin@example.com');

    // Data states
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log('AdminPage mounted, checking for admin token...');
        const adminToken = localStorage.getItem('adminToken');
        console.log('Admin token found:', adminToken ? 'Yes' : 'No');

        if (!adminToken) {
            console.log('No admin token, redirecting to /admin');
            navigate('/admin');
            return;
        }

        console.log('Admin token valid, fetching data...');
        fetchAllData();
    }, [navigate]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Import adminApi locally to use for API calls
            const token = localStorage.getItem('adminToken');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // Fetch data using axios directly to avoid the redirect interceptor
            const [postsRes, usersRes, feedbackRes] = await Promise.all([
                axios.get('/api/posts', { headers }),
                axios.get('/api/admin/users', { headers }),
                axios.get('/api/feedback', { headers }).catch(() => ({ data: [] })), // Gracefully handle feedback errors
            ]);

            setPosts(postsRes.data);
            setUsers(usersRes.data);
            setFeedback(feedbackRes.data || []);

            // Fetch comments from posts
            const allComments = [];
            for (const post of postsRes.data.slice(0, 10)) {
                try {
                    const commentsRes = await axios.get(`/api/comments/post/${post._id}`, { headers });
                    commentsRes.data.forEach(comment => {
                        allComments.push({ ...comment, postTitle: post.title });
                    });
                } catch (err) {
                    console.error('Error fetching comments for post:', err);
                }
            }
            setComments(allComments);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Don't redirect on error, just show the error
            if (error.response?.status === 401) {
                setMessage('Session expired. Please login again.');
                setTimeout(() => navigate('/admin'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Delete user "${username}"?`)) {
            const reason = prompt('Reason for deletion:');
            if (reason) {
                try {
                    await adminService.deleteUser(userId, reason);
                    setMessage('User deleted successfully');
                    fetchAllData();
                    setTimeout(() => setMessage(''), 3000);
                } catch (error) {
                    setMessage('Error deleting user');
                }
            }
        }
    };

    const handleDeletePost = async (postId, title) => {
        if (window.confirm(`Delete post "${title}"?`)) {
            const reason = prompt('Reason for deletion:');
            if (reason) {
                try {
                    await adminService.deletePost(postId, reason);
                    setMessage('Post deleted successfully');
                    fetchAllData();
                    setTimeout(() => setMessage(''), 3000);
                } catch (error) {
                    setMessage('Error deleting post');
                }
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Delete this comment?')) {
            const reason = prompt('Reason for deletion:');
            if (reason) {
                try {
                    await adminService.deleteComment(commentId, reason);
                    setMessage('Comment deleted successfully');
                    fetchAllData();
                    setTimeout(() => setMessage(''), 3000);
                } catch (error) {
                    setMessage('Error deleting comment');
                }
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    // Calculate user statistics
    const getUserStats = () => {
        const userStats = users.map(user => {
            const userPosts = posts.filter(p => p.userId?._id === user._id).length;
            const userComments = comments.filter(c => c.userId?._id === user._id).length;

            // Count likes and dislikes from posts
            let likes = 0;
            let dislikes = 0;

            return {
                name: user.fullName,
                posts: userPosts,
                likes: likes,
                dislikes: dislikes
            };
        }).slice(0, 5);

        return {
            labels: userStats.map(u => u.name),
            datasets: [
                {
                    label: 'Post Count',
                    data: userStats.map(u => u.posts),
                    backgroundColor: '#36A2EB',
                },
                {
                    label: 'Total Likes',
                    data: userStats.map(u => u.likes),
                    backgroundColor: '#4BC0C0',
                },
                {
                    label: 'Total Dislikes',
                    data: userStats.map(u => u.dislikes),
                    backgroundColor: '#FF6384',
                },
            ],
        };
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }} className={sidebarOpen ? 'sidebar-open' : ''}>
            {/* Sidebar */}
            <aside style={{
                width: sidebarOpen ? '250px' : '0',
                display: sidebarOpen ? 'block' : 'none', // Ensure it hides on mobile despite CSS !important
                backgroundColor: '#f8f9fa',
                borderRight: '1px solid #dee2e6',
                transition: 'width 0.3s',
                overflow: 'hidden'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #dee2e6' }}>
                    <h4 style={{ color: '#007bff', margin: 0 }}>
                        <i className="bi bi-bookmark-check me-2"></i>
                        ForumAdmin
                    </h4>
                </div>

                <nav style={{ padding: '10px 0' }}>
                    {[
                        { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
                        { id: 'posts', icon: 'bi-file-post', label: 'Posts' },
                        { id: 'comments', icon: 'bi-chat-dots', label: 'Comments' },
                        { id: 'users', icon: 'bi-people', label: 'Users' },
                        { id: 'statistics', icon: 'bi-bar-chart', label: 'User Statistics' },
                        { id: 'feedback', icon: 'bi-star', label: 'Feedback' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                border: 'none',
                                background: activeSection === item.id ? '#007bff' : 'transparent',
                                color: activeSection === item.id ? '#fff' : '#495057',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '15px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
                {/* Header */}
                <header style={{
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #dee2e6',
                    padding: '15px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            border: 'none',
                            background: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#495057'
                        }}
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    <div className="dropdown">
                        <button
                            className="btn btn-link dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            style={{ textDecoration: 'none', color: '#495057' }}
                        >
                            <i className="bi bi-person-circle me-2"></i>
                            <span className="d-none d-md-inline">{adminEmail}</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                        </ul>
                    </div>
                </header>

                {/* Content Area */}
                <main style={{ flex: 1, padding: '30px', backgroundColor: '#f5f7fa' }}>
                    {message && (
                        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible`}>
                            {message}
                            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Dashboard Section */}
                            {activeSection === 'dashboard' && (
                                <div>
                                    <h3 className="mb-4">Dashboard</h3>
                                    <div className="card">
                                        <div className="card-header" style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: '600' }}>
                                            Latest Posts
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr>
                                                            <th>Title</th>
                                                            <th>Preview</th>
                                                            <th>Category</th>
                                                            <th>Author</th>
                                                            <th>Date</th>
                                                            <th>Reactions</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {posts.slice(0, 10).map(post => (
                                                            <tr key={post._id}>
                                                                <td style={{ maxWidth: '200px' }}>{post.title}</td>
                                                                <td style={{ maxWidth: '250px' }}>
                                                                    {post.content.substring(0, 80)}...
                                                                </td>
                                                                <td><span className="badge bg-primary">{post.category}</span></td>
                                                                <td>{post.userId?.fullName}</td>
                                                                <td>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                                <td>
                                                                    <span className="text-success me-2">
                                                                        <i className="bi bi-hand-thumbs-up"></i> 0
                                                                    </span>
                                                                    <span className="text-danger">
                                                                        <i className="bi bi-hand-thumbs-down"></i> 0
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleDeletePost(post._id, post.title)}
                                                                        className="btn btn-danger btn-sm"
                                                                    >
                                                                        <i className="bi bi-trash me-1"></i>Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Posts Section */}
                            {activeSection === 'posts' && (
                                <div>
                                    <h3 className="mb-4">Posts</h3>
                                    <div className="card">
                                        <div className="card-header" style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: '600' }}>
                                            Latest Posts
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr>
                                                            <th>Title</th>
                                                            <th>Preview</th>
                                                            <th>Category</th>
                                                            <th>Author</th>
                                                            <th>Date</th>
                                                            <th>Reactions</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {posts.map(post => (
                                                            <tr key={post._id}>
                                                                <td style={{ maxWidth: '200px' }}>{post.title}</td>
                                                                <td style={{ maxWidth: '250px' }}>
                                                                    {post.content.substring(0, 80)}...
                                                                </td>
                                                                <td><span className="badge bg-primary">{post.category}</span></td>
                                                                <td>{post.userId?.fullName}</td>
                                                                <td>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                                <td>
                                                                    <span className="text-success me-2">
                                                                        <i className="bi bi-hand-thumbs-up"></i> 0
                                                                    </span>
                                                                    <span className="text-danger">
                                                                        <i className="bi bi-hand-thumbs-down"></i> 0
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleDeletePost(post._id, post.title)}
                                                                        className="btn btn-danger btn-sm"
                                                                    >
                                                                        <i className="bi bi-trash me-1"></i>Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Comments Section */}
                            {activeSection === 'comments' && (
                                <div>
                                    <h3 className="mb-4">Comments</h3>
                                    <div className="card">
                                        <div className="card-header" style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: '600' }}>
                                            Recent Comments
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr>
                                                            <th>Comment</th>
                                                            <th>Post</th>
                                                            <th>Author</th>
                                                            <th>Replies</th>
                                                            <th>Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {comments.map(comment => (
                                                            <tr key={comment._id}>
                                                                <td style={{ maxWidth: '300px' }}>{comment.comment}</td>
                                                                <td style={{ maxWidth: '200px' }}>{comment.postTitle || 'N/A'}</td>
                                                                <td>{comment.userId?.fullName}</td>
                                                                <td>{comment.replies?.length || 0}</td>
                                                                <td>{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleDeleteComment(comment._id)}
                                                                        className="btn btn-danger btn-sm"
                                                                    >
                                                                        <i className="bi bi-trash me-1"></i>Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Users Section */}
                            {activeSection === 'users' && (
                                <div>
                                    <h3 className="mb-4">Users</h3>
                                    <div className="card">
                                        <div className="card-header" style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: '600' }}>
                                            Registered Users
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Username</th>
                                                            <th>Email</th>
                                                            <th>Join Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {users.map(user => (
                                                            <tr key={user._id}>
                                                                <td>{user.fullName}</td>
                                                                <td>{user.username}</td>
                                                                <td>{user.email}</td>
                                                                <td>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleDeleteUser(user._id, user.username)}
                                                                        className="btn btn-danger btn-sm"
                                                                    >
                                                                        <i className="bi bi-trash me-1"></i>Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <footer className="text-center mt-4" style={{ fontSize: '14px', color: '#6c757d' }}>
                                        © Copyright <strong>ForumAdmin</strong>. All Rights Reserved
                                    </footer>
                                </div>
                            )}

                            {/* User Statistics Section */}
                            {activeSection === 'statistics' && (
                                <div>
                                    <h3 className="mb-4">User Statistics</h3>
                                    <div className="card">
                                        <div className="card-header" style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: '600' }}>
                                            User Statistics
                                        </div>
                                        <div className="card-body">
                                            <h6 className="text-center mb-4">User Activity Based on Posts, Likes, and Dislikes</h6>
                                            <Bar
                                                data={getUserStats()}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                    },
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <footer className="text-center mt-4" style={{ fontSize: '14px', color: '#6c757d' }}>
                                        © Copyright <strong>ForumAdmin</strong>. All Rights Reserved
                                    </footer>
                                </div>
                            )}

                            {/* Feedback Section */}
                            {activeSection === 'feedback' && (
                                <div>
                                    <h3 className="mb-4">Feedback</h3>
                                    <div className="card">
                                        <div className="card-header" style={{ backgroundColor: '#007bff', color: '#fff', fontWeight: '600' }}>
                                            User Feedback
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                                                        <tr>
                                                            <th>User</th>
                                                            <th>Usability</th>
                                                            <th>Design</th>
                                                            <th>Features</th>
                                                            <th>Satisfaction</th>
                                                            <th>Avg Rating</th>
                                                            <th>Comments</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {feedback.map(item => (
                                                            <tr key={item._id}>
                                                                <td>{item.userId?.fullName || 'Anonymous'}</td>
                                                                <td>{item.usability}</td>
                                                                <td>{item.design}</td>
                                                                <td>{item.features}</td>
                                                                <td>{item.satisfaction}</td>
                                                                <td><strong>{item.avgRating.toFixed(1)}</strong></td>
                                                                <td style={{ maxWidth: '200px' }}>{item.comments || 'N/A'}</td>
                                                                <td>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
