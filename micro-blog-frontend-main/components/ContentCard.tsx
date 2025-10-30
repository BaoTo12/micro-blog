import React from 'react';
import { Link } from 'react-router-dom';
import { ContentItem } from '../types';
import { useContent } from '../hooks/useContent';
import { useAuth } from '../hooks/useAuth';
import BookmarkIcon from './icons/BookmarkIcon';
import HeartIcon from './icons/HeartIcon';

interface ContentCardProps {
  item: ContentItem;
}

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const { toggleSaveItem, isItemSaved, toggleLike } = useContent();
  const { user, isAuthenticated } = useAuth();
  const saved = isItemSaved(item.id);

  const isLiked = isAuthenticated && user ? item.likedBy.includes(user.id) : false;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveItem(item.id);
  };
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && user) {
        toggleLike(item.id, user.id);
    } else {
        // Optionally, prompt to login
        alert('Please log in to like articles.');
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col">
      <Link to={`/content/${item.slug}`} className="block flex flex-col flex-grow">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={item.imageUrl} alt={item.title} />
          <span className="absolute top-4 left-4 bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full">{item.category}</span>
          <button 
            onClick={handleSaveClick} 
            className="absolute top-4 right-4 p-2 bg-white/70 backdrop-blur-sm rounded-full text-slate-700 hover:text-sky-500 hover:bg-white transition-colors"
            title={saved ? 'Unsave article' : 'Save article'}
          >
            <BookmarkIcon className="w-5 h-5" filled={saved} />
          </button>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
          <p className="text-slate-600 text-sm mb-4 flex-grow">{item.excerpt}</p>
          <div className="flex items-center justify-between text-slate-500 mt-auto">
            <div className="flex items-center">
              <img src={item.author.profilePictureUrl} alt={item.author.name} className="w-8 h-8 rounded-full mr-3" />
              <div>
                <p className="text-sm font-semibold text-slate-700">{item.author.name}</p>
                <p className="text-xs">{new Date(item.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <button 
                onClick={handleLikeClick}
                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500'}`}
                title="Like article"
            >
                <HeartIcon filled={isLiked} className="w-5 h-5" />
                <span className="text-sm font-medium">{item.likes}</span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContentCard;
