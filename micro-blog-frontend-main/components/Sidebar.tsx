import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import HomeIcon from './icons/HomeIcon';
import ContentIcon from './icons/ContentIcon';
import MessagesIcon from './icons/MessagesIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import CloseIcon from './icons/CloseIcon';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { getSavedItems } = useContent();
  const savedItems = getSavedItems();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-sky-100 text-sky-600 font-semibold' : 'text-slate-600 hover:bg-slate-200'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-slate-800">
          Synergy
        </Link>
        <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-500 hover:text-slate-800">
            <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink to="/" className={navLinkClass} onClick={() => setIsOpen(false)}>
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/content" className={navLinkClass} onClick={() => setIsOpen(false)}>
          <ContentIcon className="w-5 h-5" />
          <span>Content</span>
        </NavLink>
        <NavLink to="/messages" className={navLinkClass} onClick={() => setIsOpen(false)}>
          <MessagesIcon className="w-5 h-5" />
          <span>Messages</span>
        </NavLink>
      </nav>
      <div className="p-4 border-t border-slate-200">
        <h3 className="flex items-center space-x-3 text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
            <BookmarkIcon className="w-5 h-5" />
            <span>Saved Articles</span>
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {savedItems.length > 0 ? (
            savedItems.map(item => (
              <Link 
                key={item.id} 
                to={`/content/${item.slug}`} 
                onClick={() => setIsOpen(false)}
                className="block text-sm text-slate-600 hover:text-sky-600 truncate"
                title={item.title}
              >
                {item.title}
              </Link>
            ))
          ) : (
            <p className="text-sm text-slate-400">No articles saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50">
        {sidebarContent}
      </div>
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transition-transform transform md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;