import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { reactionService } from '../services/reactionService';
import { useAuth } from '../context/AuthContext';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const API_BASE = '';

    useEffect(() => {
        fetchPostDetails();
        fetchComments();
        fetchReactions();
    }, [id]);

    const fetchPostDetails = async () => {
        try {
            const data = await postService.getPost(id);
            setPost(data);
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const data = await commentService.getCommentsByPost(id);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const fetchReactions = async () => {
        try {
            const data = await reactionService.getPostReactions(id);
            setReactions({ likes: data.likes, dislikes: data.dislikes });
        } catch (error) {
            console.error('Error fetching reactions:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('Please login to comment');
            return;
        }
        try {
            await commentService.addComment(id, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleReplySubmit = async (commentId) => {
        if (!isAuthenticated) {
            alert('Please login to reply');
            return;
        }
        try {
            await commentService.addComment(id, replyText, commentId);
            setReplyText('');
            setReplyingTo(null);
            fetchComments();
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleReaction = async (type) => {
        if (!isAuthenticated) {
            alert('Please login to react');
            return;
        }
        try {
            await reactionService.handleReaction(id, type);
            fetchReactions();
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await commentService.deleteComment(commentId);
                fetchComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 pt-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 pt-5">
                    <div className="alert alert-warning">Post not found</div>
                    <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mt-5 pt-4 pt-md-5 pb-4 pb-md-5">
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        {/* Back Button */}
                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-3">
                            <i className="bi bi-arrow-left me-2"></i>Back
                        </button>

                        {/* Post Card */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h1 className="card-title mb-3">{post.title}</h1>

                                {/* Post Metadata */}
                                <div className="d-flex flex-wrap gap-3 mb-3 text-muted small">
                                    <span><i className="bi bi-person me-1"></i>{post.userId?.fullName}</span>
                                    <span><i className="bi bi-calendar me-1"></i>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span><i className="bi bi-tag me-1"></i>{post.category}</span>
                                    <span><i className="bi bi-lock me-1"></i>{post.privacy}</span>
                                </div>

                                {/* Media */}
                                {post.image && (
                                    <img
                                        src={`${API_BASE}/uploads/${post.image}`}
                                        alt={post.title}
                                        className="img-fluid rounded mb-3 w-100"
                                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                                    />
                                )}
                                {post.video && (
                                    <video
                                        src={`${API_BASE}/uploads/${post.video}`}
                                        controls
                                        className="img-fluid rounded mb-3 w-100"
                                        style={{ maxHeight: '500px' }}
                                    />
                                )}

                                {/* Content */}
                                <div className="post-content mb-4">
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                                </div>

                                {/* Reactions */}
                                <div className="d-flex gap-3 mb-3">
                                    <button
                                        onClick={() => handleReaction('like')}
                                        className="btn btn-outline-success btn-sm"
                                        disabled={!isAuthenticated}
                                    >
                                        <i className="bi bi-hand-thumbs-up me-1"></i>
                                        Like ({reactions.likes})
                                    </button>
                                    <button
                                        onClick={() => handleReaction('dislike')}
                                        className="btn btn-outline-danger btn-sm"
                                        disabled={!isAuthenticated}
                                    >
                                        <i className="bi bi-hand-thumbs-down me-1"></i>
                                        Dislike ({reactions.dislikes})
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-4">
                                    <i className="bi bi-chat-dots me-2"></i>
                                    Comments ({comments.length})
                                </h4>

                                {/* Add Comment Form */}
                                {isAuthenticated ? (
                                    <form onSubmit={handleCommentSubmit} className="mb-4">
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Write a comment..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            <i className="bi bi-send me-2"></i>Post Comment
                                        </button>
                                    </form>
                                ) : (
                                    <div className="alert alert-info mb-4">
                                        Please <a href="/login">login</a> to comment
                                    </div>
                                )}

                                {/* Comments List */}
                                <div className="comments-list">
                                    {comments.length > 0 ? (
                                        comments.map(comment => (
                                            <div key={comment._id} className="border-bottom pb-3 mb-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <strong>{comment.userId?.fullName}</strong>
                                                        <small className="text-muted ms-2">
                                                            {new Date(comment.createdAt).toLocaleString()}
                                                        </small>
                                                        <p className="mb-2 mt-1">{comment.comment}</p>

                                                        {/* Reply Link */}
                                                        {isAuthenticated && (
                                                            <button
                                                                onClick={() => setReplyingTo(comment._id)}
                                                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                                            >
                                                                <i className="bi bi-reply me-1"></i>Reply
                                                            </button>
                                                        )}

                                                        {/* Delete Button (if user owns comment) */}
                                                        {user?._id === comment.userId?._id && (
                                                            <button
                                                                onClick={() => handleDeleteComment(comment._id)}
                                                                className="btn btn-link btn-sm p-0 text-danger text-decoration-none ms-3"
                                                            >
                                                                <i className="bi bi-trash me-1"></i>Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Reply Form */}
                                                {replyingTo === comment._id && (
                                                    <div className="mt-3 ms-4">
                                                        <textarea
                                                            className="form-control mb-2"
                                                            rows="2"
                                                            placeholder="Write a reply..."
                                                            value={replyText}
                                                            onChange={(e) => setReplyText(e.target.value)}
                                                        />
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                onClick={() => handleReplySubmit(comment._id)}
                                                                className="btn btn-sm btn-primary"
                                                            >
                                                                Post Reply
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setReplyingTo(null);
                                                                    setReplyText('');
                                                                }}
                                                                className="btn btn-sm btn-outline-secondary"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Nested Replies */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="ms-4 mt-3">
                                                        {comment.replies.map(reply => (
                                                            <div key={reply._id} className="border-start border-3 ps-3 mb-2">
                                                                <strong>{reply.userId?.fullName}</strong>
                                                                <small className="text-muted ms-2">
                                                                    {new Date(reply.createdAt).toLocaleString()}
                                                                </small>
                                                                <p className="mb-0 mt-1">{reply.comment}</p>
                                                                {user?._id === reply.userId?._id && (
                                                                    <button
                                                                        onClick={() => handleDeleteComment(reply._id)}
                                                                        className="btn btn-link btn-sm p-0 text-danger text-decoration-none"
                                                                    >
                                                                        <i className="bi bi-trash me-1"></i>Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted text-center">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostDetailPage;
