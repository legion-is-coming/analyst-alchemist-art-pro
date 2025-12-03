import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  MinusSquare,
  Send,
  Terminal,
  X,
  Move,
  Trash2
} from 'lucide-react';
import { sendMessageStream, initializeChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'analyst_alchemist_chat_history';

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const { t, dictionary } = useLanguage();
  const chatCopy = dictionary.chat;
  // Load messages from local storage or use default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      {
        role: 'model',
        content: chatCopy.initial_message,
        timestamp: Date.now()
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dragging state - using Absolute position (Top/Left) instead of transform for easier boundary clamping
  const [position, setPosition] = useState({
    x: Math.max(0, window.innerWidth - 450 - 40),
    y: Math.max(0, window.innerHeight - 600 - 40)
  });

  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Save to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Initialize chat session with history on mount
  useEffect(() => {
    const history = messages
      .filter((m) => !m.content.startsWith('Error:')) // Filter out errors from context
      .map((m) => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

    // Initialize the Gemini session with restored history
    initializeChat(history);
  }, []);

  // Dragging logic - Only active on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || window.innerWidth < 768) return; // Disable on mobile

      // Calculate new top/left based on mouse position and initial offset
      let newX = e.clientX - dragOffsetRef.current.x;
      let newY = e.clientY - dragOffsetRef.current.y;

      // Boundary constraints
      const widgetWidth = 450;
      const widgetHeight = 600;
      const maxX = window.innerWidth - widgetWidth;
      const maxY = window.innerHeight - widgetHeight;

      // Clamp values
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return;
    isDraggingRef.current = true;
    // Record the offset from the top-left corner of the widget
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleClearHistory = () => {
    const initialMsg: ChatMessage = {
      role: 'model',
      content: chatCopy.initial_message,
      timestamp: Date.now()
    };
    setMessages([initialMsg]);
    localStorage.removeItem(STORAGE_KEY);
    // Re-initialize session without history
    initializeChat();
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: '', timestamp: Date.now() }
      ]);

      const stream = sendMessageStream(userMsg.content);

      for await (const chunk of stream) {
        setMessages((prev) => {
          const newArr = [...prev];
          const lastIndex = newArr.length - 1;
          if (lastIndex >= 0 && newArr[lastIndex].role === 'model') {
            newArr[lastIndex] = {
              ...newArr[lastIndex],
              content: newArr[lastIndex].content + chunk
            };
          }
          return newArr;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: chatCopy.error,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={widgetRef}
      style={{
        left: window.innerWidth >= 768 ? `${position.x}px` : '0',
        top: window.innerWidth >= 768 ? `${position.y}px` : '0'
      }}
      className='fixed md:w-[450px] md:h-[600px] w-full h-full bg-cp-black border border-cp-border flex flex-col z-[999] shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in fade-in duration-200'>
      {/* Header - Draggable Area */}
      <div
        onMouseDown={handleMouseDown}
        className='bg-cp-dark border-b border-cp-border p-4 flex justify-between items-center cursor-move select-none active:bg-cp-dim transition-colors group shrink-0'>
        <div className='flex items-center gap-2 text-cp-yellow'>
          <Terminal size={18} strokeWidth={2} />
          <span className='font-bold tracking-wider font-sans text-base'>
            {chatCopy.header}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={handleClearHistory}
            className='text-cp-text-muted hover:text-cp-red transition-colors p-1'
            title={chatCopy.clear_title}
            onMouseDown={(e) => e.stopPropagation()}>
            <Trash2 size={16} />
          </button>
          <Move
            size={14}
            className='text-cp-text-muted group-hover:text-cp-text hidden md:block'
          />
          <button
            onClick={onClose}
            className='text-cp-text-muted hover:text-cp-yellow transition-colors p-1'
            onMouseDown={(e) => e.stopPropagation()}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4 font-mono text-base custom-scrollbar bg-cp-black'>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div
              className={`max-w-[85%] p-3 relative ${
                msg.role === 'user'
                  ? 'bg-cp-dim text-cp-text border-l-2 border-cp-yellow'
                  : 'bg-cp-dark text-cp-text-muted border-l-2 border-cp-cyan'
              }`}>
              <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {isThinking && messages[messages.length - 1]?.role === 'user' && (
          <div className='text-cp-cyan text-sm animate-pulse pl-2 font-mono'>
            {chatCopy.typing}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className='p-4 bg-cp-dark border-t border-cp-border shrink-0'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={chatCopy.placeholder}
            className='flex-1 bg-cp-black border border-cp-border text-cp-text p-3 text-sm focus:border-cp-yellow focus:outline-none placeholder-gray-600 font-mono rounded-none'
          />
          <button
            onClick={handleSend}
            disabled={isThinking}
            className='bg-cp-yellow text-black p-3 hover:bg-white transition-colors rounded-sm'>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
