import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContent } from '../hooks/useContent';
import Button from '../components/Button';
import FacebookIcon from '../components/icons/FacebookIcon';
import ContentCard from '../components/ContentCard';

const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getSavedItems } = useContent();
  const navigate = useNavigate();

  const savedItems = getSavedItems();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-8">
          <img src={user.profilePictureUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-sky-500 mb-4 sm:mb-0 flex-shrink-0" />
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-600 text-lg mt-1">{user.email}</p>
            <p className="text-slate-500 text-sm mt-2">Member since {new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
            <p className="mt-4 text-slate-700 max-w-xl mx-auto sm:mx-0">{user.bio}</p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 space-y-4">
             <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <FacebookIcon className="w-8 h-8 text-facebook-blue"/>
                    <div>
                        <p className="font-semibold text-slate-800">Facebook</p>
                        <p className="text-sm text-slate-500">Connected</p>
                    </div>
                </div>
                <Button variant="secondary">Disconnect</Button>
            </div>
             <Button onClick={handleLogout} className="w-full" variant="secondary">
                Log Out
            </Button>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Saved Articles</h2>
        {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedItems.map(item => <ContentCard key={item.id} item={item} />)}
            </div>
        ) : (
            <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
                <p className="text-slate-500">You haven't saved any articles yet.</p>
                <Button onClick={() => navigate('/content')} className="mt-4">Explore Content</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;