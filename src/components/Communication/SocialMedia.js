import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Share2, 
  Camera, 
  Heart, 
  MessageCircle,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';

const SocialMedia = ({ clients = [] }) => {
  const [activePlatform, setActivePlatform] = useState('instagram');
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [showScheduled, setShowScheduled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Symulowane dane z galerii
  const galleryImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop',
      caption: 'Przed zabiegiem - peeling chemiczny',
      tags: ['przed', 'peeling', 'twarz']
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      caption: 'Po zabiegu - rezultat po 2 tygodniach',
      tags: ['po', 'peeling', 'rezultat']
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
      caption: 'Makijaż wieczorowy na wesele',
      tags: ['makijaż', 'wieczorowy', 'wesele']
    }
  ];

  // Symulowane posty
  const recentPosts = [
    {
      id: 1,
      platform: 'instagram',
      content: 'New gallery photos! Check out our treatment results 💫 #cosmetology #skincare',
      image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=300&fit=crop',
      likes: 45,
      comments: 12,
      shares: 8,
      postedAt: '2024-01-15T10:00:00',
      status: 'published'
    },
    {
      id: 2,
      platform: 'facebook',
      content: 'January promotion! 20% off all skincare treatments. Come visit us!',
      likes: 23,
      comments: 5,
      shares: 3,
      postedAt: '2024-01-14T15:30:00',
      status: 'published'
    }
  ];

  // Symulowane zaplanowane posty
  const scheduledPosts = [
    {
      id: 1,
      platform: 'instagram',
      content: 'Before and after - chemical peeling results ✨',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      scheduledFor: '2024-01-16T12:00:00',
      status: 'scheduled'
    }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: '#1DA1F2' }
  ];

  const handleImageSelect = (image) => {
    if (selectedImages.find(img => img.id === image.id)) {
      setSelectedImages(selectedImages.filter(img => img.id !== image.id));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedImages.length === 0) {
      toast.error('Dodaj treść lub zdjęcie do posta');
      return;
    }

    setIsLoading(true);
    try {
      // Symulacja wysłania posta
      console.log('Creating post:', {
        platform: activePlatform,
        content: postContent,
        images: selectedImages,
        scheduledFor: scheduledTime || null
      });

      // Reset form
      setPostContent('');
      setSelectedImages([]);
      setScheduledTime('');
      
      toast.success('Post created!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error occurred while creating post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!scheduledTime) {
      toast.error('Select publication time');
      return;
    }
    if (!postContent.trim() && selectedImages.length === 0) {
      toast.error('Add content or image to the post');
      return;
    }

    setIsLoading(true);
    try {
      // Symulacja planowania posta
      console.log('Scheduling post:', {
        platform: activePlatform,
        content: postContent,
        images: selectedImages,
        scheduledFor: scheduledTime
      });

      setPostContent('');
      setSelectedImages([]);
      setScheduledTime('');
      setShowScheduled(false);
      
      toast.success('Post scheduled!');
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error('Error occurred while scheduling post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="social-media">
      <div className="social-header">
        <h2>Social Media</h2>
        <div className="social-actions">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary"
            onClick={() => setShowScheduled(!showScheduled)}
            title="Pokaż zaplanowane posty"
          >
            <Calendar size={18} />
            Scheduled posts
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary" 
            onClick={handleCreatePost}
            disabled={isLoading}
            title="Utwórz post"
          >
            {isLoading ? <Loader size={18} /> : <Share2 size={18} />}
            {isLoading ? 'Tworzenie...' : 'Create post'}
          </motion.button>
        </div>
      </div>

      <div className="social-content">
        {/* Platform selection */}
        <div className="platforms-section">
          <h3>Select platform</h3>
          <div className="platforms-grid">
            {platforms.map((platform) => (
              <motion.button
                key={platform.id}
                className={`platform-btn ${activePlatform === platform.id ? 'active' : ''}`}
                onClick={() => setActivePlatform(platform.id)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 16px rgba(102, 126, 234, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  borderColor: activePlatform === platform.id ? platform.color : 'transparent',
                  background: activePlatform === platform.id ? `${platform.color}20` : 'transparent'
                }}
                title={`Wybierz platformę: ${platform.name}`}
              >
                <platform.icon size={24} style={{ color: platform.color }} />
                <span>{platform.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Post editor */}
        <div className="post-editor">
          <div className="editor-section">
            <label>Post content</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`Co chcesz opublikować na ${platforms.find(p => p.id === activePlatform)?.name}? Dodaj hashtagi #`}
              rows={4}
              className="post-textarea"
            />
            <div className="character-count">
              {postContent.length} characters
            </div>
          </div>

          {/* Gallery image selection */}
          <div className="gallery-section">
            <h3>Select images from gallery</h3>
            <div className="gallery-grid">
              {galleryImages.map((image) => (
                <motion.div
                  key={image.id}
                  className={`gallery-item ${selectedImages.find(img => img.id === image.id) ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(image)}
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  title={`Wybierz zdjęcie: ${image.caption}`}
                >
                  <img src={image.url} alt={image.caption} />
                  <div className="image-overlay">
                    <div className="image-caption">{image.caption}</div>
                    <div className="image-tags">
                      {image.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  {selectedImages.find(img => img.id === image.id) && (
                    <div className="selected-indicator">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scheduling */}
          <div className="scheduling-section">
            <label>
              <input
                type="checkbox"
                checked={showScheduled}
                onChange={(e) => setShowScheduled(e.target.checked)}
              />
              Schedule publication
            </label>
            
            <AnimatePresence>
              {showScheduled && (
                <motion.div
                  className="scheduling-options"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="schedule-input"
                  />
                  <button 
                    className="btn-secondary"
                    onClick={handleSchedulePost}
                    disabled={!scheduledTime || (!postContent.trim() && selectedImages.length === 0)}
                  >
                    <Calendar size={16} />
                    Schedule post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recent posts */}
        <div className="recent-posts-section">
          <h3>Recent posts</h3>
          <div className="posts-list">
            {recentPosts.map((post) => (
              <motion.div
                key={post.id}
                className="post-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="post-header">
                  <div className="post-platform">
                    {(() => {
                      const platform = platforms.find(p => p.id === post.platform);
                      return platform?.icon ? <platform.icon size={20} style={{ color: platform.color }} /> : null;
                    })()}
                    <span>{platforms.find(p => p.id === post.platform)?.name}</span>
                  </div>
                  <span className="post-time">
                    {new Date(post.postedAt).toLocaleString('pl-PL')}
                  </span>
                </div>
                
                <div className="post-content">
                  <p>{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="Post" className="post-image" />
                  )}
                </div>
                
                <div className="post-stats">
                  <span className="stat">
                    <Heart size={16} />
                    {post.likes}
                  </span>
                  <span className="stat">
                    <MessageCircle size={16} />
                    {post.comments}
                  </span>
                  <span className="stat">
                    <Share2 size={16} />
                    {post.shares}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scheduled posts */}
        <AnimatePresence>
          {showScheduled && (
            <motion.div
              className="scheduled-posts-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3>Scheduled posts</h3>
              <div className="scheduled-posts-list">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="scheduled-post-item">
                    <div className="post-info">
                      <div className="post-header-info">
                        <h4>
                          {(() => {
                            const platform = platforms.find(p => p.id === post.platform);
                            return platform?.icon ? <platform.icon size={16} style={{ color: platform.color }} /> : null;
                          })()}
                          {platforms.find(p => p.id === post.platform)?.name}
                        </h4>
                        <span className="post-scheduled-time">
                          Scheduled for: {new Date(post.scheduledFor).toLocaleString('pl-PL')}
                        </span>
                      </div>
                      <p className="post-message">{post.content}</p>
                      {post.image && (
                        <img src={post.image} alt="Scheduled post" className="scheduled-post-image" />
                      )}
                    </div>
                    <div className="post-actions">
                      <button className="btn-icon" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="btn-icon delete" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialMedia; 