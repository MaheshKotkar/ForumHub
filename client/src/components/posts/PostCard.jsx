import { Link } from 'react-router-dom';

const PostCard = ({ post, showActions = false, onDelete }) => {
    const API_BASE = '';

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text text-truncate" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                    {post.content}
                </p>

                {/* Media */}
                {post.image && (
                    <img
                        src={`${API_BASE}/uploads/${post.image}`}
                        alt="Post"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                    />
                )}
                {post.video && (
                    <video
                        src={`${API_BASE}/uploads/${post.video}`}
                        controls
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: '200px', width: '100%' }}
                    />
                )}

                {/* Post Metadata */}
                <div className="mt-3">
                    <small className="text-muted d-block">
                        <i className="bi bi-tag me-1"></i>
                        Category: {post.category}
                    </small>
                    <small className="text-muted d-block">
                        <i className="bi bi-person me-1"></i>
                        Posted by: {post.userId?.fullName || 'Unknown'}
                    </small>
                    <small className="text-muted d-block">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                    <small className="text-muted d-block">
                        <i className="bi bi-lock me-1"></i>
                        Privacy: {post.privacy}
                    </small>
                </div>

                {/* Actions */}
                <div className="mt-3">
                    {!showActions && (
                        <Link to={`/post/${post._id}`} className="btn btn-primary btn-sm">
                            Read More
                        </Link>
                    )}
                    {showActions && (
                        <div className="d-flex gap-2">
                            <Link to={`/post/${post._id}/edit`} className="btn btn-warning btn-sm">
                                <i className="bi bi-pencil"></i> Edit
                            </Link>
                            <button onClick={() => onDelete && onDelete(post._id)} className="btn btn-danger btn-sm">
                                <i className="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostCard;
