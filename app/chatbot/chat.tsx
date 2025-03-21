'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Send, Menu, X, BarChart2, Mail, Search, Users, FileText, Moon, Sun } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ServiceButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  isActive?: boolean;
  darkMode: boolean;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  inputBg: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! Welcome to our digital marketing assistant.", sender: 'bot', timestamp: new Date() },
    { id: 2, text: "How can I help you with your marketing needs today?", sender: 'bot', timestamp: new Date(Date.now() + 100) }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Define theme colors
  const lightTheme: ThemeColors = {
    primary: '#B9FF66',
    secondary: '#191A23',
    background: '#F3F3F3',
    card: '#FFFFFF',
    text: '#191A23',
    border: '#E5E7EB',
    inputBg: '#FFFFFF'
  };

  const darkTheme: ThemeColors = {
    primary: '#B9FF66',
    secondary: '#191A23',
    background: '#121212',
    card: '#1E1E1E',
    text: '#F3F3F3',
    border: '#333333',
    inputBg: '#2D2D2D'
  };

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('seo') || lowerMessage.includes('search engine')) {
      return "Our SEO services help improve your website's visibility in search results. We conduct keyword research, optimize on-page elements, and build quality backlinks to drive organic traffic.";
    } else if (lowerMessage.includes('ppc') || lowerMessage.includes('pay per click') || lowerMessage.includes('advertising')) {
      return "Our Pay-Per-Click advertising services deliver targeted ads to potential customers. We manage campaigns across Google, Facebook, and other platforms to maximize your ROI.";
    } else if (lowerMessage.includes('social') || lowerMessage.includes('facebook') || lowerMessage.includes('instagram')) {
      return "Our Social Media Marketing services help build your brand presence online. We create engaging content, grow your audience, and drive meaningful engagement across platforms.";
    } else if (lowerMessage.includes('email')) {
      return "Our Email Marketing services help you connect directly with your audience. We design campaigns that nurture leads, retain customers, and drive conversions.";
    } else if (lowerMessage.includes('content')) {
      return "Our Content Creation services provide high-quality, engaging content that resonates with your audience. From blog posts to videos, we help tell your brand story.";
    } else if (lowerMessage.includes('analytics') || lowerMessage.includes('tracking')) {
      return "Our Analytics and Tracking services provide insights into your marketing performance. We set up dashboards and reports to help you make data-driven decisions.";
    } else if (lowerMessage.includes('dark') || lowerMessage.includes('theme') || lowerMessage.includes('mode')) {
      return `The chat is currently in ${darkMode ? 'dark' : 'light'} mode. You can switch modes using the toggle in the top right corner.`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help with your digital marketing needs today?";
    } else {
      return "I'd be happy to discuss how our digital marketing services can help your business grow online. Could you tell me which specific service you're interested in learning more about?";
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const ServiceButton: React.FC<ServiceButtonProps> = ({ icon, text, onClick, darkMode }) => {
    // Determine if this service should have the dark background
    const isDarkService = text === 'Social Media Marketing' || text === 'Analytics and Tracking';
    
    // In dark mode, we need to invert the color scheme for the service buttons
    const bgColor = isDarkService
      ? (darkMode ? theme.card : theme.secondary) 
      : (darkMode ? '#2D2D2D' : '#F3F3F3');
    
    const textColor = isDarkService
      ? (darkMode ? theme.primary : 'white')
      : (darkMode ? '#F3F3F3' : theme.secondary);

    return (
      <button 
        className="flex items-center gap-2 p-4 rounded-xl w-full mb-2 transition-all hover:translate-x-1"
        style={{ 
          backgroundColor: bgColor,
          color: textColor
        }}
        onClick={onClick}
      >
        {icon}
        <span className="text-left">{text}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: theme.background }}>
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full shadow-md"
        style={{ backgroundColor: theme.card, color: theme.text }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Theme toggle */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 rounded-full shadow-md transition-colors"
        style={{ backgroundColor: theme.card, color: theme.text }}
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 w-80 border-r fixed md:static top-0 bottom-0 left-0 z-40 overflow-y-auto`}
        style={{ 
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        <div className="p-6">
          <div className="inline-block px-3 py-1 mb-6 font-bold rounded-md" style={{ backgroundColor: theme.primary, color: theme.secondary }}>
            Services
          </div>
          
          <div className="space-y-1">
            <ServiceButton 
              icon={<Search size={20} />} 
              text="Search Engine Optimization"
              darkMode={darkMode}
              onClick={() => {
                setInputValue("Tell me about Search Engine Optimization");
                setSidebarOpen(false);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
            />
            <ServiceButton 
              icon={<BarChart2 size={20} />} 
              text="History 1"
              darkMode={darkMode}
              onClick={() => {
                setInputValue("Tell me about Pay-per-click Advertising");
                setSidebarOpen(false);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
            />
            <ServiceButton 
              icon={<Users size={20} />} 
              text="History 2"
              darkMode={darkMode}
              onClick={() => {
                setInputValue("Tell me about Social Media Marketing");
                setSidebarOpen(false);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <header 
          className="px-6 py-4 border-b shadow-sm flex items-center justify-between"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border
          }}
        >
          <h1 className="text-xl font-bold" style={{ color: theme.text }}>Marketing Assistant</h1>
        </header>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: theme.background }}>
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    message.sender === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'
                  }`}
                  style={{ 
                    backgroundColor: message.sender === 'user' ? theme.secondary : theme.primary,
                    color: message.sender === 'user' ? 'white' : theme.secondary,
                  }}
                >
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70 text-right">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <div 
          className="border-t p-4"
          style={{ 
            backgroundColor: theme.card,
            borderColor: theme.border
          }}
        >
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-4 pr-12 rounded-xl border focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text, 
                }}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full"
                style={{ backgroundColor: theme.primary }}
                disabled={!inputValue.trim()}
              >
                <Send size={20} style={{ color: theme.secondary }} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Chatbot;