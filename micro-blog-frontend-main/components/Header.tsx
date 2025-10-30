import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import MenuIcon from './icons/MenuIcon';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
             <button onClick={onMenuClick} className="md:hidden mr-4 text-slate-500 hover:text-slate-800">
                <MenuIcon className="w-6 h-6" />
             </button>
            <Link to="/" className="text-2xl font-bold text-slate-800">
              Synergy
            </Link>
          </div>
         
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <span className="font-medium text-slate-700 hidden sm:inline">{user?.name}</span>
                <img src={user?.profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-sky-500" />
              </Link>
            ) : (
              <Link to="/login">
                  <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;