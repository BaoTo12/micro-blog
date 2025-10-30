import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CONVERSATIONS, MOCK_USERS } from '../constants';
import { Conversation, Message } from '../types';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [selectedConversation?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConvId) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: { id: user.id, name: user.name, profilePictureUrl: user.profilePictureUrl },
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setConversations(prevConvs => 
      prevConvs.map(conv => 
        conv.id === selectedConvId 
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
    setNewMessage('');
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p.id !== user?.id);
  };
  
  if (!user) {
      return <div>Please log in to see messages.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">Messages</h1>
        </div>
        <div className="flex-grow overflow-y-auto">
          {conversations.map(conv => {
            const otherUser = getOtherParticipant(conv);
            const lastMessage = conv.messages[conv.messages.length - 1];
            return (
              <div
                key={conv.id}
                className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-slate-100 ${selectedConvId === conv.id ? 'bg-sky-50' : ''}`}
                onClick={() => setSelectedConvId(conv.id)}
              >
                <img src={otherUser?.profilePictureUrl} alt={otherUser?.name} className="w-12 h-12 rounded-full" />
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-slate-800 truncate">{otherUser?.name}</p>
                  <p className="text-sm text-slate-500 truncate">{lastMessage?.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
              <img src={getOtherParticipant(selectedConversation)?.profilePictureUrl} alt={getOtherParticipant(selectedConversation)?.name} className="w-10 h-10 rounded-full" />
              <h2 className="text-lg font-bold text-slate-800">{getOtherParticipant(selectedConversation)?.name}</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
              {selectedConversation.messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender.id === user.id ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender.id !== user.id && <img src={msg.sender.profilePictureUrl} alt={msg.sender.name} className="w-8 h-8 rounded-full self-start" />}
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender.id === user.id ? 'bg-sky-500 text-white rounded-br-none' : 'bg-slate-200 text-slate-800 rounded-bl-none'}`}>
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Button type="submit" className="!px-4 !py-2 rounded-full">Send</Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            <p>Select a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;