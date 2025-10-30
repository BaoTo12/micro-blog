
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FacebookIcon from '../components/icons/FacebookIcon';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleFacebookLogin = () => {
    login();
  };
  
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle email/password auth here.
    // For this mock, we'll just log the user in to show the flow.
    login();
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Welcome Back</h1>
        <p className="text-center text-slate-500 mb-8">Log in to continue to Synergy.</p>

        <Button variant="facebook" onClick={handleFacebookLogin} className="w-full text-lg mb-6">
          <FacebookIcon className="w-6 h-6" />
          <span>Continue with Facebook</span>
        </Button>
        
        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-slate-300" />
          <span className="mx-4 text-sm font-semibold text-slate-400">OR</span>
          <hr className="flex-grow border-t border-slate-300" />
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" id="email" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" id="password" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">
            Log In with Email
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
