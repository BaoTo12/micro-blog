import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import ContentListingPage from './pages/ContentListingPage';
import ContentDetailPage from './pages/ContentDetailPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <ContentProvider>
        <HashRouter>
          <div className="flex min-h-screen bg-slate-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col transition-all duration-300 md:ml-64">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/content" element={<ContentListingPage />} />
                  <Route path="/content/:slug" element={<ContentDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </HashRouter>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;