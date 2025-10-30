
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FacebookIcon from '../components/icons/FacebookIcon';
import ContentCard from '../components/ContentCard';
import { MOCK_CONTENT } from '../constants';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFacebookLogin = () => {
    login();
    navigate('/profile');
  };

  return (
    <div className="space-y-16">
      <section className="text-center py-16 px-4 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4">Connect. Share. Discover.</h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
          Join our community to explore amazing content and share your discoveries with friends, seamlessly integrated with your social world.
        </p>
        <Button variant="facebook" onClick={handleFacebookLogin} className="text-lg">
          <FacebookIcon className="w-6 h-6" />
          <span>Continue with Facebook</span>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CONTENT.slice(0, 3).map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
