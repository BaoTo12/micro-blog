
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useContent } from '../hooks/useContent';
import ContentCard from '../components/ContentCard';
import Spinner from '../components/Spinner';

const ITEMS_PER_PAGE = 6;

const ContentListingPage: React.FC = () => {
  const { getAllContent } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // FIX: The useMemo hook expects a factory function. It is safer and more explicit to provide an arrow function.
  const allContent = useMemo(() => getAllContent(), [getAllContent]);

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(allContent.map(item => item.category)))]
  , [allContent]);

  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory, allContent]);

  const [displayedContent, setDisplayedContent] = useState(() => filteredContent.slice(0, ITEMS_PER_PAGE));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(filteredContent.length > ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);
  
  // Reset on filter change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    setDisplayedContent(filteredContent.slice(0, ITEMS_PER_PAGE));
    setHasMore(filteredContent.length > ITEMS_PER_PAGE);
    setLoading(false);
  }, [filteredContent]);

  // Load more items effect
  useEffect(() => {
    if (page > 1) {
      setLoading(true);
      const nextPageStart = (page - 1) * ITEMS_PER_PAGE;
      const nextPageEnd = nextPageStart + ITEMS_PER_PAGE;
      
      // Simulate network latency
      setTimeout(() => {
        const newItems = filteredContent.slice(nextPageStart, nextPageEnd);
        setDisplayedContent(prev => [...prev, ...newItems]);
        setHasMore(filteredContent.length > nextPageEnd);
        setLoading(false);
      }, 500);
    }
  }, [page, filteredContent]);

  return (
    <div className="space-y-8">
      <section className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Explore Content</h1>
        <p className="text-lg text-slate-600">Discover articles on React, CSS, TypeScript, and more.</p>
      </section>

      <section className="sticky top-[70px] bg-slate-100/80 backdrop-blur-sm z-10 py-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedContent.map((item, index) => {
            if (displayedContent.length === index + 1) {
              return <div ref={lastElementRef} key={item.id}><ContentCard item={item} /></div>
            } else {
              return <ContentCard key={item.id} item={item} />
            }
          })}
        </div>
        {loading && (
          <div className="text-center py-8">
            <Spinner />
          </div>
        )}
        {!hasMore && displayedContent.length > 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>You've reached the end!</p>
          </div>
        )}
        {displayedContent.length === 0 && !loading && (
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
            <p className="text-slate-500">No articles found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ContentListingPage;
