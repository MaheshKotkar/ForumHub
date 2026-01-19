import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PostCard from '../components/posts/PostCard';
import { postService } from '../services/postService';
import { feedbackService } from '../services/feedbackService';
import { contactService } from '../services/contactService';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [feedbackData, setFeedbackData] = useState({
        usability: 0,
        design: 0,
        features: 0,
        satisfaction: 0,
        comments: ''
    });
    const [contactData, setContactData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, [search, category]);

    const fetchPosts = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;
            const data = await postService.getPosts(params);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    const handleCategoryClick = (cat) => {
        setCategory(cat === 'All' ? '' : cat);
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await feedbackService.submitFeedback(feedbackData);
            setFeedbackMessage('Thank you for your feedback!');
            setFeedbackData({ usability: 0, design: 0, features: 0, satisfaction: 0, comments: '' });
            setTimeout(() => setFeedbackMessage(''), 3000);
        } catch (error) {
            setFeedbackMessage('Error submitting feedback. Please login first.');
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            await contactService.submitContact(contactData);
            setContactMessage('Message sent successfully!');
            setContactData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setContactMessage(''), 3000);
        } catch (error) {
            setContactMessage('Error sending message. Please try again.');
        }
    };

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="hero" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%)',
                padding: '60px 0',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <div className="container py-5">
                    <h1 className="display-5 display-md-4 fw-bold welcome-text-animated" style={{ marginTop: '60px' }}>
                        {user ? `${user.fullName}, Welcome to ForumHub!` : 'Welcome to ForumHub'}
                    </h1>
                    <div className="animate-fade-in-up stagger-1">
                        <p className="lead fst-italic welcome-subtitle">"Connect, Share, and Grow Together."</p>
                        <p className="text-muted">Join the community, share your thoughts, and explore interesting topics!</p>
                    </div>
                    {!isAuthenticated && (
                        <div className="animate-fade-in-up stagger-2">
                            <a href="/signup" className="btn btn-primary btn-lg mt-3 professional-card">Get Started</a>
                        </div>
                    )}
                </div>
            </section>

            {/* Posts Section */}
            <section id="posts" className="py-5">
                <div className="container">
                    <div className="row">
                        {/* Sidebar Filter */}
                        <div className="col-lg-3 mb-4">
                            <h4>Filter by Category</h4>
                            <ul className="list-group">
                                {['Technology', 'Education', 'Entertainment', 'Lifestyle', 'Health', 'All'].map(cat => (
                                    <li
                                        key={cat}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleCategoryClick(cat)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Posts Grid */}
                        <div className="col-lg-9">
                            <h4 className="mb-4">
                                {search ? `Search Results for: "${search}"` :
                                    category ? `Posts in Category: "${category}"` :
                                        'All Posts'}
                            </h4>

                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {posts.length > 0 ? (
                                        posts.map(post => (
                                            <div key={post._id} className="col-md-6 col-lg-4">
                                                <PostCard post={post} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <p className="text-center text-muted">No posts found.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Feedback Section */}
            <section id="feedback" className="py-5 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 className="fw-bold mb-3" style={{ color: '#00c6ff' }}>Feedback</h2>
                            <p>We value your feedback! Please rate your experience with ForumHub.</p>
                        </div>
                    </div>

                    {isAuthenticated ? (
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                {feedbackMessage && (
                                    <div className={`alert ${feedbackMessage.includes('Thank') ? 'alert-success' : 'alert-warning'}`}>
                                        {feedbackMessage}
                                    </div>
                                )}
                                <form onSubmit={handleFeedbackSubmit} className="card p-4 shadow">
                                    {['usability', 'design', 'features', 'satisfaction'].map(field => (
                                        <div key={field} className="mb-3">
                                            <label className="form-label text-capitalize">
                                                How would you rate the {field} of ForumHub?
                                            </label>
                                            <div className="d-flex justify-content-around">
                                                {[5, 4, 3, 2, 1].map(rating => (
                                                    <div key={rating} className="form-check">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            name={field}
                                                            value={rating}
                                                            id={`${field}-${rating}`}
                                                            onChange={() => setFeedbackData({ ...feedbackData, [field]: rating })}
                                                            required
                                                        />
                                                        <label className="form-check-label" htmlFor={`${field}-${rating}`}>
                                                            {rating}⭐
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mb-3">
                                        <label htmlFor="comments" className="form-label">Additional Comments:</label>
                                        <textarea
                                            className="form-control"
                                            id="comments"
                                            rows="3"
                                            value={feedbackData.comments}
                                            onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                                            placeholder="Your feedback is valuable to us!"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">Submit Feedback</button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="alert alert-info">Please <a href="/login">login</a> to submit feedback.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="py-5" style={{ background: '#fff' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center mb-5">
                            <h2 className="fw-bold mb-3" style={{ color: '#00c6ff' }}>Contact Us</h2>
                            <p className="text-muted">Have any questions or suggestions? We'd love to hear from you.</p>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="professional-card shadow-sm" style={{ borderRadius: '15px' }}>
                                <div className="card-body p-4">
                                    {contactMessage && (
                                        <div className={`alert ${contactMessage.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                                            {contactMessage}
                                        </div>
                                    )}
                                    <form onSubmit={handleContactSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                value={contactData.name}
                                                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                                                required
                                                placeholder="Your Name"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                value={contactData.email}
                                                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                                required
                                                placeholder="Your Email"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="subject" className="form-label">Subject</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subject"
                                                value={contactData.subject}
                                                onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                                                required
                                                placeholder="Subject"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="message" className="form-label">Message</label>
                                            <textarea
                                                className="form-control"
                                                id="message"
                                                rows="4"
                                                value={contactData.message}
                                                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                                                required
                                                placeholder="Your Message..."
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">Send Message</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </>
    );
};

export default HomePage;
