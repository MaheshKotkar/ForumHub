import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Technology',
        privacy: 'public',
        image: null,
        video: null,
        existingImage: '',
        existingVideo: ''
    });

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const post = await postService.getPost(id);

            // Check if user owns this post
            if (post.userId._id !== user._id) {
                setMessage('You can only edit your own posts');
                setTimeout(() => navigate('/dashboard'), 2000);
                return;
            }

            setFormData({
                title: post.title,
                content: post.content,
                category: post.category,
                privacy: post.privacy,
                image: null,
                video: null,
                existingImage: post.image || '',
                existingVideo: post.video || ''
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            setMessage('Error loading post');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updateFormData = new FormData();
        updateFormData.append('title', formData.title);
        updateFormData.append('content', formData.content);
        updateFormData.append('category', formData.category);
        updateFormData.append('privacy', formData.privacy);

        if (formData.image) {
            updateFormData.append('image', formData.image);
        }
        if (formData.video) {
            updateFormData.append('video', formData.video);
        }

        try {
            await postService.updatePost(id, updateFormData);
            setMessage('Post updated successfully!');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            console.error('Error updating post:', error);
            setMessage('Error updating post. Please try again.');
            setLoading(false);
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

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
                <div className="container py-4">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            {message && (
                                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="card shadow-sm">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h2>Edit Post</h2>
                                        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                                            <i className="bi bi-arrow-left me-2"></i>Cancel
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Post Title</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="content" className="form-label">Post Content</label>
                                            <textarea
                                                className="form-control"
                                                id="content"
                                                name="content"
                                                rows="8"
                                                value={formData.content}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <select
                                                className="form-select"
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                            >
                                                <option value="Technology">Technology</option>
                                                <option value="Education">Education</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Lifestyle">Lifestyle</option>
                                                <option value="Health">Health</option>
                                            </select>
                                        </div>

                                        {/* Current Media Display */}
                                        {(formData.existingImage || formData.existingVideo) && (
                                            <div className="mb-3">
                                                <label className="form-label">Current Media</label>
                                                <div className="border rounded p-3">
                                                    {formData.existingImage && (
                                                        <div className="mb-2">
                                                            <small className="text-muted d-block mb-1">Current Image:</small>
                                                            <img
                                                                src={`/uploads/${formData.existingImage}`}
                                                                alt="Current"
                                                                className="img-thumbnail"
                                                                style={{ maxHeight: '150px' }}
                                                            />
                                                        </div>
                                                    )}
                                                    {formData.existingVideo && (
                                                        <div>
                                                            <small className="text-muted d-block mb-1">Current Video:</small>
                                                            <video
                                                                src={`/uploads/${formData.existingVideo}`}
                                                                controls
                                                                className="img-thumbnail"
                                                                style={{ maxHeight: '150px' }}
                                                            />
                                                        </div>
                                                    )}
                                                    <small className="text-info">Upload a new file below to replace</small>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">
                                                Update Image {formData.existingImage && '(optional - leave empty to keep current)'}
                                            </label>
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
                                            <label htmlFor="video" className="form-label">
                                                Update Video {formData.existingVideo && '(optional - leave empty to keep current)'}
                                            </label>
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
                                                        onChange={handleChange}
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
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="private">Private</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                <i className="bi bi-save me-2"></i>
                                                {loading ? 'Updating...' : 'Update Post'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => navigate(-1)}
                                                className="btn btn-outline-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditPostPage;
