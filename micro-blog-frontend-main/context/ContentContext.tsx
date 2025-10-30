import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { MOCK_CONTENT } from '../constants';
import { ContentItem, Comment } from '../types';

interface ContentContextType {
  // Saved items
  savedItems: string[];
  toggleSaveItem: (itemId: string) => void;
  isItemSaved: (itemId: string) => boolean;
  getSavedItems: () => ContentItem[];
  
  // Content interaction
  getAllContent: () => ContentItem[];
  getContentBySlug: (slug: string) => ContentItem | undefined;
  toggleLike: (contentId: string, userId: string) => void;
  addComment: (contentId: string, comment: Comment) => void;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<ContentItem[]>(MOCK_CONTENT);
  const [savedItems, setSavedItems] = useState<string[]>(() => {
    try {
      const items = window.localStorage.getItem('savedContentItems');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('savedContentItems', JSON.stringify(savedItems));
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [savedItems]);

  const toggleSaveItem = useCallback((itemId: string) => {
    setSavedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const isItemSaved = useCallback((itemId: string) => {
    return savedItems.includes(itemId);
  }, [savedItems]);

  const getSavedItems = useCallback(() => {
    return content.filter(item => savedItems.includes(item.id));
  }, [savedItems, content]);
  
  const getAllContent = useCallback(() => {
    return content;
  }, [content]);

  const getContentBySlug = useCallback((slug: string) => {
    return content.find(item => item.slug === slug);
  }, [content]);

  const toggleLike = useCallback((contentId: string, userId: string) => {
    setContent(prevContent => 
      prevContent.map(item => {
        if (item.id === contentId) {
          const isLiked = item.likedBy.includes(userId);
          return {
            ...item,
            likes: isLiked ? item.likes - 1 : item.likes + 1,
            likedBy: isLiked 
              ? item.likedBy.filter(id => id !== userId)
              : [...item.likedBy, userId],
          };
        }
        return item;
      })
    );
  }, []);

  const addComment = useCallback((contentId: string, comment: Comment) => {
    setContent(prevContent =>
      prevContent.map(item =>
        item.id === contentId
          ? { ...item, comments: [...item.comments, comment] }
          : item
      )
    );
  }, []);

  const value = useMemo(() => ({
    savedItems,
    toggleSaveItem,
    isItemSaved,
    getSavedItems,
    getAllContent,
    getContentBySlug,
    toggleLike,
    addComment,
  }), [savedItems, content, toggleSaveItem, isItemSaved, getSavedItems, getAllContent, getContentBySlug, toggleLike, addComment]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
