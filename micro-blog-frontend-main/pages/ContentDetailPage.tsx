import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useAuth } from '../hooks/useAuth';
import { Comment } from '../types';
import Button from '../components/Button';
import BookmarkIcon from '../components/icons/BookmarkIcon';
import HeartIcon from '../components/icons/HeartIcon';
import ShareToolbar from '../components/ShareToolbar';
import Spinner from '../components/Spinner';

const ContentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getContentBySlug, toggleSaveItem, isItemSaved, toggleLike, addComment } = useContent();
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  
  const item = slug ? getContentBySlug(slug) : undefined;

  useEffect(() => {
    if (!item) {
      const timer = setTimeout(() => navigate('/content', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [item, navigate]);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-64 bg-white rounded-2xl shadow-lg">
        <Spinner />
        <h2 className="text-2xl font-bold text-slate-700 mt-4">Article not found</h2>
        <p className="text-slate-500">Redirecting you to the content page...</p>
      </div>
    );
  }

  const saved = isItemSaved(item.id);
  const isLiked = isAuthenticated && user ? item.likedBy.includes(user.id) : false;

  const handleLikeClick = () => {
      if (isAuthenticated && user) {
          toggleLike(item.id, user.id);
      } else {
          alert('Please log in to like this article');
      }
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    const comment: Comment = {
      id: `c-${Date.now()}`,
      author: {
        id: user.id,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl
      },
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    addComment(item.id, comment);
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <img src={item.imageUrl} alt={item.title} className="w-full h-64 md:h-96 object-cover" />
      <div className="p-6 sm:p-8 md:p-12">
        <div className="mb-8">
          <Link to="/content" className="text-sky-600 hover:underline font-semibold text-sm">{`< Back to all articles`}</Link>
        </div>

        <span className="text-sm font-bold uppercase text-sky-600">{item.category}</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-6">{item.title}</h1>

        <div className="flex items-center mb-8 border-y border-slate-200 py-4">
          <img src={item.author.profilePictureUrl} alt={item.author.name} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <p className="font-semibold text-slate-800">{item.author.name}</p>
            <p className="text-sm text-slate-500">Published on {new Date(item.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <article 
          className="prose lg:prose-xl max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={handleLikeClick} variant={isLiked ? 'secondary' : 'secondary'} className={`!flex items-center gap-2 ${isLiked ? 'text-red-500 border-red-300' : 'text-slate-600'}`}>
                <HeartIcon className="w-5 h-5" filled={isLiked} />
                {item.likes} {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button onClick={() => toggleSaveItem(item.id)} variant={saved ? 'primary' : 'secondary'}>
              <BookmarkIcon className="w-5 h-5 mr-2" filled={saved} />
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
          <ShareToolbar url={window.location.href} title={item.title} />
        </div>
        
        {/* Comments Section */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{item.comments.length} Comments</h2>
          <div className="space-y-6">
            {isAuthenticated && user ? (
              <form onSubmit={handleCommentSubmit} className="flex items-start space-x-4">
                <img src={user.profilePictureUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    rows={3}
                  />
                  <Button type="submit" className="mt-2" disabled={!newComment.trim()}>Post Comment</Button>
                </div>
              </form>
            ) : (
                <div className="text-center p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <p className="text-slate-600"><Link to="/login" className="text-sky-600 font-semibold hover:underline">Log in</Link> to post a comment.</p>
                </div>
            )}
            
            {item.comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-4">
                <img src={comment.author.profilePictureUrl} alt={comment.author.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <p className="font-semibold text-slate-800">{comment.author.name}</p>
                    <p className="text-slate-700">{comment.text}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContentDetailPage;
